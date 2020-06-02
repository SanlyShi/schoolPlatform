
const appDetailFlow = (resolve) =>
    require(['../pages/application/applicationDetail.vue'], resolve)
const appDetailForm = (resolve) =>
    require(['../pages/application/applicationDetailMyForm.vue'], resolve)
const appDetailLink = (resolve) =>
    require(['../pages/application/applicationDetailLink.vue'], resolve)



export default {
    '/app/flow': appDetailFlow,
    '/app/form': appDetailForm,
    '/app/link': appDetailLink
}
