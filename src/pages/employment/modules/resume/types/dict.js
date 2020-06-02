const ResumeCompleteStatus = {
  INCOMPLETED: 0,
  COMPLETED: 1
}

const ResumeCompleteStatusLabel = {
  [ResumeCompleteStatus.INCOMPLETED]: '未完成',
  [ResumeCompleteStatus.COMPLETED]: '已完成'
}

const ResumeType = {
  FILE: 'FILE',
  ONLINE: 'ONLINE'
}

const ResumeTypeLabel = {
  [ResumeType.FILE]: '文件简历',
  [ResumeType.ONLINE]: '在线简历'
}

export {
  ResumeCompleteStatus, ResumeCompleteStatusLabel,
  ResumeType, ResumeTypeLabel
}
