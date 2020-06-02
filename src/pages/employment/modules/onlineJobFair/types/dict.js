const UnitApplyAuditStatus = {
  AUDITING: 0,
  PASSED: 1,
  FAILED: 2,
  COUNTERMAND: 3,
  REJECT: 4
}

const UnitApplyAuditStatusLabel = {
  [UnitApplyAuditStatus.AUDITING]: '待审核',
  [UnitApplyAuditStatus.PASSED]: '已通过',
  [UnitApplyAuditStatus.FAILED]: '未通过',
  [UnitApplyAuditStatus.COUNTERMAND]: '已撤回',
  [UnitApplyAuditStatus.REJECT]: '已驳回'
}

const UnitApplyAuditStatusLabelBrief = {
  [UnitApplyAuditStatus.REJECT]: '已驳回'
}

const UnitApplyAuditStatusLabelColorType = {
  [UnitApplyAuditStatus.AUDITING]: 'warning',
  [UnitApplyAuditStatus.PASSED]: 'success',
  [UnitApplyAuditStatus.FAILED]: 'danger',
  [UnitApplyAuditStatus.COUNTERMAND]: 'warning',
  [UnitApplyAuditStatus.REJECT]: 'warning'
}

const UnitApplyAuditStatusOptions = []
for (const id in UnitApplyAuditStatusLabel) {
  UnitApplyAuditStatusOptions.push({ id, text: UnitApplyAuditStatusLabel[id] })
}

export {
  UnitApplyAuditStatus,
  UnitApplyAuditStatusLabel,
  UnitApplyAuditStatusLabelBrief,
  UnitApplyAuditStatusLabelColorType,
  UnitApplyAuditStatusOptions
}
