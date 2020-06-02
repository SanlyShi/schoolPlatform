<template>
    <div id='loadPdf'>
        <div class="row">
            <h1>基本信息</h1>
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label">姓名</label>
                    <label class="label-content">{{studentInfoData.name}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label">学号</label>
                    <label class="label-content">{{studentInfoData.userNo}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label">年级</label>
                    <label class="label-content">{{studentInfoData.grade}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label">学院</label>
                    <label class="label-content">{{studentInfoData.collegeName}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label">邮箱</label>
                    <label class="label-content">{{studentInfoData.email}}</label>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label two-words-difference-margin">班级</label>
                    <label class="label-content">{{studentInfoData.className}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label">培养层次</label>
                    <label class="label-content">{{studentInfoData.educationLevelLabel}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label">政治面貌</label>
                    <label class="label-content">{{studentInfoData.politicalStatusLabel}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label">性别</label>
                    <label class="label-content">{{studentInfoData.sexLabel}}</label>
                  </div>
                  <div class="form-group" v-if="exportingToPdf">
                    <label class="form-label">联系方式</label>
                    <label class="label-content">{{studentInfoData.contact}}</label>
                  </div>
                  <div class="form-group" v-else>
                    <label class="form-label">联系方式</label>  
                    <label class="label-content">{{studentInfoData.contact}}</label>
                  </div>
                </div>
              </div>
    
        <div class="row">
            <h1>预约填写额外信息</h1>
            <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label two-words-difference-margin">家庭成员</label>
                    <label class="label-content">{{studentInfoData.familyMembers}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label">父母婚姻情况</label>
                    <label class="label-content">{{studentInfoData.parentsMarriageSituation}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label">本次咨询内容</label>
                    <label class="label-content">{{studentInfoData.content}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label">本次咨询备注</label>
                    <label class="label-content">{{studentInfoData.remark}}</label>
                  </div>

                  <div class="form-group">
                    <label class="form-label">是否有精神科就医经历</label>
                    <label class="label-content">{{studentInfoData.hasPsychiatricHistory}}</label>
                  </div>
                  <div class="form-group" v-if="studentInfoData.hasPsychiatricHistory == '是'">
                    <label class="form-label">医院</label>
                    <label class="label-content">{{studentInfoData.hospital}}</label>
                  </div>
                  <div class="form-group" v-if="studentInfoData.hasPsychiatricHistory == '是'">
                    <label class="form-label">医生姓名</label>
                    <label class="label-content">{{studentInfoData.doctor}}</label>
                  </div>
                  <div class="form-group" v-if="studentInfoData.hasPsychiatricHistory == '是'">
                    <label class="form-label">服用药物</label>
                    <label class="label-content">{{studentInfoData.drug}}</label>
                  </div>

                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label one-words-difference-margin">家庭精神病史</label>
                    <label class="label-content">{{studentInfoData.psychiatricHistory}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label one-words-difference-margin">是否服用药物</label>
                    <label class="label-content">{{studentInfoData.takeMedicine}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label">是否有咨询记录</label>
                    <label class="label-content">{{studentInfoData.hasConsultingExperience}}</label>
                  </div>
                    <div class="form-group" v-if="studentInfoData.hasConsultingExperience == '是'">
                    <label class="form-label three-words-difference-margin">咨询时间</label>
                    <label class="label-content">{{studentInfoData.consultingDate}}</label>
                  </div>
                  <div class="form-group" v-if="studentInfoData.hasConsultingExperience == '是'">
                    <label class="form-label three-words-difference-margin">咨询地点</label>
                    <label class="label-content">{{studentInfoData.consultingAddress}}</label>
                  </div>
                  <div class="form-group" v-if="studentInfoData.hasConsultingExperience == '是'">
                    <label class="form-label three-words-difference-margin">咨询主题</label>
                    <label class="label-content">{{studentInfoData.consultingMainContent}}</label>
                  </div>
                </div>
                
        </div>
        <div class="row">
            <h1>本次咨询记录</h1>
            <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label three-words-difference-margin">咨询时间</label>
                    <label class="label-content">{{infoData.dayTime.dateTime}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label">咨询师联系方式</label>
                    <label class="label-content">{{infoData.teacher.contact}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label two-words-difference-margin" >咨询师姓名</label>
                    <label class="label-content">{{infoData.teacher.name}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label five-words-difference-margin" >状态</label>
                    <label class="label-content">{{statusLabel[infoData.status]}}</label>
                  </div>
                </div>
        </div>
    
    
    
    
    </div>
</template>
<script>
export default {
    // props: ['studentInfoData','infoData'],
    data() {
        return {
          studentInfoData: {},
          infoData: {},
             statusLabel: {
                SUCCESS: "预约成功",
                CANCELED: "取消预约",
                CANCELED_BY_ADMIN: "后台取消",
                ING: "进行中",
                FINISHED: "已结束",
                DONE: "已完成",
                ABSENT: "未到",
                ABORT: "排班被取消"
            },
        }
    }
}
</script>