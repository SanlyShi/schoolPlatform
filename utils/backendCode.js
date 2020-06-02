const codes = {
  'apiLost': {
    'zh-cn': '系统升级中...',
    'en': 'Backend interrupt, wait to restart.',
    showCode: false
  },
  '88888': {
    'zh-cn': '成功',
    'en': 'Success',
    showCode: false
  },
  /* 位置错误 */
  '00002': {
    'zh-cn': '操作太快了',
    'en': 'API Error, report back to the developer, please!',
    showCode: false
  },
  '00000': {
    'zh-cn': '接口访问出错啦！',
    'en': 'API Error, report back to the developer, please!',
    showCode: false
  },
  '10005': {
    'zh-cn': '信息填写有误',
    'en': 'API Error, report back to the developer, please!',
    showCode: false
  },
  '10006': {
    'zh-cn': '无需缴费',
    'en': 'API Error, report back to the developer, please!',
    showCode: false
  },
  '10998':{
    'zh-cn': '事务名称、键值不能重复',
    'en': 'API Error, report back to the developer, please!',
    showCode: false
  },
  /* 请求错误 */
  '00001': {
    'zh-cn': '请求失败',
    'en': 'Request failed',
    showCode: false
  },
  /* 参数错误：10001-19999 */
  '10001': {
    'zh-cn': '参数数据无效！',
    'en': 'Invalid arguments',
    showCode: false
  },
  '10002': {
    'zh-cn': '参数为空！',
    'en': 'Arguments are null',
    showCode: false
  },
  '10003': {
    'zh-cn': '参数类型错误！',
    'en': 'Arguments type error',
    showCode: false
  },
  '10004': {
    'zh-cn': '参数缺失！',
    'en': 'Arguments lost',
    showCode: false
  },
  '10999': {
    'zh-cn': '该工号不是导师，请先在【全校导师信息】中添加该工号！',
    'en': 'Arguments lost',
    showCode: false
  },
  /* 用户错误：20001-29999 */
  '20001': {
    'zh-cn': '您还没有登录，请登录！',
    'en': 'Not login',
    showCode: false
  },
  '20002': {
    'zh-cn': '账号不存在或密码错误',
    'en': 'Account number or password error',
    showCode: false
  },
  '20003': {
    'zh-cn': '账号已被禁用',
    'en': 'Account is disabled',
    showCode: false
  },
  '20004': {
    'zh-cn': '用户不存在',
    'en': 'Account not exist',
    showCode: false
  },
  '20005': {
    'zh-cn': '用户已存在',
    'en': 'Account exist',
    showCode: false
  },
  '20006': {
    'zh-cn': '邮件发送失败',
    'en': 'Account exist',
    showCode: false
  },
  '20007': {
    'zh-cn': '跳转链接必须以http://或https://开头',
    'en': 'Account exist',
    showCode: false
  },
  '20008': {
    'zh-cn': '已开启的轮播数量超过5张，无法开启',
    'en': 'Account exist',
    showCode: false
  },
  '20009': {
    'zh-cn': '已开启的轮播数量超过5张，无法新增',
    'en': 'Account exist',
    showCode: false
  },
  '20010': {
    'zh-cn': '近期未发送验证码给该邮箱',
    'en': 'Account exist',
    showCode: false
  },
  '20011': {
    'zh-cn': '邮箱格式不正确',
    'en': 'Account exist',
    showCode: false
  },
  '20012': {
    'zh-cn': '账号或密码错误，请重新输入',
    'en': 'Account exist',
    showCode: false
  },
  '20013': {
    'zh-cn': '邮箱验证码不正确',
    'en': 'Account exist',
    showCode: false
  },
  '20014': {
    'zh-cn': '"邮箱验证码已过期',
    'en': 'Account exist',
    showCode: false
  },
  '20015': {
    'zh-cn': '邮箱已注册',
    'en': 'Account exist',
    showCode: false
  },
  '20017': {
    'zh-cn': '身份证已注册',
    'en': 'Account exist',
    showCode: false
  },
  '20106': {
    'zh-cn': '姓名/身份证号输入有误',
    'en': 'Account exist',
    showCode: false
  },
  '20020': {
    'zh-cn': '旧密码错误',
    'en': 'Account exist',
    showCode: false
  },
  '20021': {
    'zh-cn': '用户邮箱缺失',
    'en': 'User mailbox missing',
    showCode: false
  },
  '20022': {
    'zh-cn': '近期未发送验证码给该邮箱',
    'en': 'No verification code has been sent to this email recently',
    showCode: false
  },
  '20023': {
    'zh-cn': '邮箱验证码已过期',
    'en': 'Email verification code expired',
    showCode: false
  },
  '20024': {
    'zh-cn': '邮箱验证码不正确',
    'en': 'Incorrect email verification code',
    showCode: false
  },
  '20025': {
    'zh-cn': '新密码与现有密码一致',
    'en': 'The new password is the same as the existing password',
    showCode: false
  },
  '20026': {
    'zh-cn': '邮件发送失败',
    'en': 'Failed to send mail',
    showCode: false
  },
  '20027': {
    'zh-cn': '邮件发送失败',
    'en': 'Failed to send mail',
    showCode: false
  },

  /* 业务错误：30001-39999 */
  '30001': {
    'zh-cn': '字典标签不允许相同！',
    'en': 'The dictionary tags are not allowed to be the same!',
    showCode: false
  },
  '30002': {
    'zh-cn': '字典值不允许相同！',
    'en': 'The dictionary value is not allowed to be the same!',
    showCode: false
  },

  '30101': {
    'zh-cn': '流程没有开始节点！',
    'en': 'Start node lost in the process!',
    showCode: false
  },
  '30102': {
    'zh-cn': '流程异常咯，快去看看你的流程配置吧！',
    'en': 'Process settting error!',
    showCode: false
  },
  '30103': {
    'zh-cn': '表单数据的类型错误了！',
    'en': 'The type of form data occurs error!',
    showCode: false
  },
  '30104': {
    'zh-cn': '表单数据必填呢！',
    'en': 'The form data is required!',
    showCode: false
  },
  '30105': {
    'zh-cn': '申请者的班级不存在！',
    'en': 'The applier is not belong to any class!',
    showCode: true
  },
  '30106': {
    'zh-cn': '操作异常！',
    'en': 'Operation not allow!',
    showCode: true
  },
  '30107': {
    'zh-cn': '该流程已被处理过咯，不能再撤回！',
    'en': 'Process is going on, you can not cancel!',
    showCode: false
  },
  '30108': {
    'zh-cn': '该流程不允许被驳回到此节点！',
    'en': 'This node is not allow to be reject to!',
    showCode: false
  },
  '30201': {
    'zh-cn': '该角色已经被使用，不能删除！',
    'en': 'Role is already used, you can not remove!',
    showCode: false
  },
  '30202': {
    'zh-cn': '该角色已经设置人员，不能删除！',
    'en': 'Role is already set, you can not remove!',
    showCode: false
  },
  '30210': {
    'zh-cn': '当前导师已有带生关系，请到带生关系设置中解除',
    'en': 'Role is already set, you can not remove!',
    showCode: false
  },
  '30301': {
    'zh-cn': '该业务不支持统计！',
    'en': 'The business does not support statistics!',
    showCode: false
  },
  '30111': {
    'zh-cn': '申请者的辅导员不存在！',
    'en': 'The business does not support statistics!',
    showCode: false
  },
  '30400': {
    'zh-cn': '您输入的身份证号与帐号不匹配',
    'en': 'account or id card number is invalid',
    showCode: false
  },
  '30401': {
    'zh-cn': '你输入的密码和帐号不匹配',
    'en': 'account or password is invalid',
    showCode: false
  },
  '30500': {
    'zh-cn': '活动评价已提交',
    'en': 'Already committed!',
    showCode: false
  },
  '30501': {
    'zh-cn': '不在报名时间内,请稍后再试！',
    'en': 'Time does not allow',
    showCode: false
  },
  '30502': {
    'zh-cn': '今日报名次数已达上限3次，不可报名，请明日再试！',
    'en': 'Times of sign in limited!',
    showCode: false
  },
  '30503': {
    'zh-cn': '活动已结束，取消报名无效！',
    'en': 'Activity over, cancel sign in failed!',
    showCode: false
  },
  '30504': {
    'zh-cn': '报名人数已满！',
    'en': 'Your number is full!',
    showCode: false
  },
  '30505': {
    'zh-cn': '抱歉，您不属于该活动面向群体！',
    'en': 'No permission!',
    showCode: false
  },
  '30509': {
    'zh-cn': '活动定位没有设置流程！',
    'en': 'Error!',
    showCode: false
  },
  '30510': {
    'zh-cn': '活动类型已被使用！',
    'en': 'Error!',
    showCode: false
  },
  '30601': {
    'zh-cn': '您已签到，请勿重复签到！',
    'en': 'Had Sign',
    showCode: false
  },
  '30506': {
    'zh-cn': '活动已结束，不可下架！',
    'en': 'Can not ',
    showCode: false
  },
  '30508': {
    'zh-cn': '报名未通过',
    'en': 'Apply not pass'
  },
  // '30601': {
  //   'zh-cn': '已经签到过了',
  //   'en': 'Had Sign'
  // },
  '30602': {
    'zh-cn': '不在签到时间内，请稍后再试！',
    'en': 'Not in sign time',
    showCode: false
  },
  '30603': {
    'zh-cn': '您尚未签到！',
    'en': 'Had not sign',
    showCode: false
  },
  '30604': {
    'zh-cn': '签到名称已存在，请重新命名！',
    'en': 'Had same sign name',
    showCode: false
  },
  '30605': {
    'zh-cn': '链接已失效！',
    'en': 'Url invalid',
    showCode: false
  },
  '30606': {
    'zh-cn': '地址不存在！',
    'en': 'Address error',
    showCode: false
  },
  '30607': {
    'zh-cn': '签到码已过期，请重新扫码',
    'en': 'Sign code already out of time',
    showCode: false
  },
  '30608': {
    'zh-cn': '不在该签到名单中',
    'en': 'not this qrCode'
  },
  '30609': {
    'zh-cn': '签到失败，您不可以通过此二维码进行签到',
    'en': 'not this proxy',
    showCode: false
  },
  '30610': {
    'zh-cn': '该签到不属于定位签到',
    'en': 'The sign-in is not part of the registration sign-in',
    showCode: false
  },
  '30611': {
    'zh-cn': '该签到不属于扫码签到',
    'en': 'The sign-in does not belong to the scan code sign-in',
    showCode: false
  },
  '30612': {
    'zh-cn': '该签到不属于外勤签到',
    'en': 'The sign-in does not belong to the scan code sign-in',
    showCode: false
  },
  // 勤工助学
  '30801': {
    'zh-cn': '导入excel出错！',
    'en': 'Error occurs while importing',
    showCode: false
  },
  '30802': {
    'zh-cn': '您已提交过申请,请勿重复提交',
    'en': 'You have submitted your application, please do not submit it again',
    showCode: false
  },
  '30803': {
    'zh-cn': '流程配置错误',
    'en': 'Error!',
    showCode: false
  },
  '30804': {
    'zh-cn': '岗位未审核通过',
    'en': 'Not pass！',
    showCode: false
  },
  '30805': {
    'zh-cn': '岗位已被禁用',
    'en': 'Forbidden!',
    showCode: false
  },
  '30806': {
    'zh-cn': '页面已超时，请刷新后重试',
    'en': 'The page has timed out, please refresh and try again',
    showCode: false
  },
  '30807': {
    'zh-cn': '已经有学生申请该岗位，不能删除',
    'en': 'Some students have applied for this position and cannot delete it.',
    showCode: false
  },
  '30808': {
    'zh-cn': '不在岗位申请时间内！',
    'en': 'Time limited!',
    showCode: false
  },
  '30809': {
    'zh-cn': '无法再申请该岗位类型相关岗位!',
    'en': 'Type imited!',
    showCode: false
  },
  '30810': {
    'zh-cn': '岗位人数已满!',
    'en': 'The number of jobs is full!',
    showCode: false
  },
  '30811': {
    'zh-cn': '添加失败！该生的岗位数量已超过系统限制!',
    'en': 'Fail!',
    showCode: false
  },
  '30812': {
    'zh-cn': '固定节点无法被删除!',
    'en': 'Error!',
    showCode: false
  },
  '30901': {
    'zh-cn': '已有业务在此时间段中进行，请重新设置业务时间段！',
    'en': 'Bussiness going on',
    showCode: false
  },
  '30902': {
    'zh-cn': '存在业务，不可删除！',
    'en': 'Bussiness exist, movement refused',
    showCode: false
  },
  '30903': {
    'zh-cn': '当前时间不在可预约时间内！',
    'en': 'Time limited!',
    showCode: false
  },
  '30904': {
    'zh-cn': '您不是心理咨询师，无法新增排班',
    'en': 'Time limited!',
    showCode: false
  },
  '30905': {
    'zh-cn': '抱歉，您没有预约记录',
    'en': 'Time limited!',
    showCode: false
  },
  '30906': {
    'zh-cn': '抱歉，暂无之前预约老师的排班信息',
    'en': 'Time limited!',
    showCode: false
  },
  '30909': {
    'zh-cn': '不能修改以往排班',
    'en': 'Time limited!',
    showCode: false
  },
  '31108': {
    'zh-cn': '该应用还未关联流程，请尽快关联！',
    'en': 'Process missed, set it for the app please!',
    showCode: false
  },
  '31109': {
    'zh-cn': '业务管理名单异常，请重新提交！',
    'en': 'The form of business manage error, please commit it again!',
    showCode: false
  },
  '31110': {
    'zh-cn': '业务期时间不能和其它业务时间重叠！',
    'en': 'Business time must be non-overlapping!',
    showCode: false
  },
  '31111': {
    'zh-cn': '该角色已有业务绑定，请选择其它角色！',
    'en': 'The role you choose is already binded business!',
    showCode: false
  },
  '31112': {
    'zh-cn': '该应用分类下还有应用，不能删除！',
    'en': 'The application type is not allow to remove because it is not null!',
    showCode: false
  },
  '31113': {
    'zh-cn': '导入文件格式有误！',
    'en': 'File type error, check your import!',
    showCode: false
  },
  '31114': {
    'zh-cn': '应用未发布，请发布后重试！',
    'en': 'The application is unpulished!',
    showCode: false
  },
  '31115': {
    'zh-cn': '满足该业务期限制的用户不存在！',
    'en': 'Users not found!',
    showCode: false
  },
  '31116': {
    'zh-cn': '业务期已发布！',
    'en': 'The business is already pulished!',
    showCode: false
  },
  '31117': {
    'zh-cn': '存在已发布且正在进行中的业务期，无法下架应用！',
    'en': 'The app already has pulished business!',
    showCode: false
  },
  '31118': {
    'zh-cn': '应用已发布，请先下架应用',
    'en': 'The application is already pulished, Please drop off application',
    showCode: false
  },
  '31119': {
    'zh-cn': '该业务期只能申请一次！',
    'en': 'This business period can apply only once!',
    showCode: false
  },
  '31120': {
    'zh-cn': '业务期正在发布中，请耐心等待',
    'en': 'Business period is being released, please be patient',
    showCode: false
  },
  '31121': {
    'zh-cn': '业务期已经停用',
    'en': 'Business is enable',
    showCode: false
  },
  '31130': {
    'zh-cn': '已经收藏该应用',
    'en': 'Already have bookmarked the app',
    showCode: false
  },
  '31201': {
    'zh-cn': '英文简称已存在',
    'en': 'Already have bookmarked the app',
    showCode: false
  },
  '31202': {
    'zh-cn': '名称已存在',
    'en': 'Already have bookmarked the app',
    showCode: false
  },
  '31203': {
    'zh-cn': '英文简称只能由字母、下划线组成',
    'en': 'Already have bookmarked the app',
    showCode: false
  },
  '32015': {
    'zh-cn': '请勿重复登记！',
    'en': 'Don‘t register repeatedly',
    showCode: false
  },
  '32104': {
    'zh-cn': '抱歉，该时间段已有老师排班，不允许删除！',
    'en': 'Don‘t register repeatedly',
    showCode: false
  },
  '32017': {
    'zh-cn': '不存在该属性！',
    'en': 'Undefined properity',
    showCode: false
  },
  '32018': {
    'zh-cn': '字典名称重复请重新输入',
    'en': 'Dictionary name repeat',
    showCode: false
  },
  '32019': {
    'zh-cn': '字典选项不能为空',
    'en': 'Empty Dictionary value!',
    showCode: false
  },
  '32020': {
    'zh-cn': '字典选项不能重复',
    'en': 'Dictionary repeat!',
    showCode: false
  },
  '32101': {
    'zh-cn': '此时可通过名额为0',
    'en': 'Dictionary repeat!',
    showCode: false
  },
  '32102': {
    'zh-cn': '您是老师，请勿进行心理预约',
    'en': 'Dictionary repeat!',
    showCode: false
  },
  '32103': {
    'zh-cn': '抱歉，您近段时间有过预约记录，请勿重复预约；若想再次预约，请先取消之前的预约',
    'en': 'Dictionary repeat!',
    showCode: false
  },
  '32110': {
    'zh-cn': '微信appId和appSecret为空',
    'en': 'Dictionary repeat!',
    showCode: false
  },
  '32104': {
    'zh-cn': '抱歉，该时间段已有老师排班，不允许删除',
    'en': 'Dictionary repeat!',
    showCode: false
  },
  '32201': {
    'zh-cn': '代码已存在',
    'en': 'Error!',
    showCode: false
  },
  '32202': {
    'zh-cn': '名称已存在',
    'en': 'Error!',
    showCode: false
  },
  '32203': {
    'zh-cn': '该学院下设有专业，不允许删除！',
    'en': 'Error!',
    showCode: false
  },
  '10101': {
    'zh-cn': '数量超出限制！',
    'en': 'AMOUNT OUT OF RANGE!',
    showCode: false
  },
  /* 系统错误：40001-49999 */
  '40001': {
    'zh-cn': '系统拼命工作中， 稍等一下哈！',
    'en': 'Server busy, try it later please',
    showCode: false
  },

  /* 数据错误：50001-599999 */
  '50001': {
    'zh-cn': '数据未找到！',
    'en': 'Data not found',
    showCode: false
  },
  '50002': {
    'zh-cn': '数据有误！',
    'en': 'Data Error',
    showCode: false
  },
  '50003': {
    'zh-cn': '数据已存在！',
    'en': 'Data already exist',
    showCode: false
  },
  '50004': {
    'zh-cn': '禁止删除，请勿重复操作！',
    'en': 'Data is not allow to be remove!',
    showCode: false
  },
  '50005': {
    'zh-cn': '该数据为只读，不可修改！',
    'en': 'Data is not allow to be rewrite!',
    showCode: false
  },
  '50006': {
    'zh-cn': '该学院下有所属学生，不可修改代码',
    'en': 'Error',
    showCode: false
  },
  '50007': {
    'zh-cn': '该专业下有所属学生，不可修改代码',
    'en': 'Error',
    showCode: false
  },
  '50008': {
    'zh-cn': '该学院下有所属学生，不可删除',
    'en': 'Error',
    showCode: false
  },
  '50009': {
    'zh-cn': '该专业下有所属学生，不可删除',
    'en': 'Error',
    showCode: false
  },

  /* 接口错误：60001-69999 */
  '60001': {
    'zh-cn': '文件过大！',
    'en': 'File too large',
    showCode: false
  },
  '60002': {
    'zh-cn': '文件格式有误！',
    'en': 'File type error',
    showCode: false
  },
  '60003': {
    'zh-cn': '该接口禁止访问！',
    'en': 'Api disabled',
    showCode: false
  },
  '60004': {
    'zh-cn': '接口地址无效！',
    'en': 'Invalid api',
    showCode: false
  },
  '60005': {
    'zh-cn': '接口请求超时！',
    'en': 'Api request timeout',
    showCode: false
  },
  '60006': {
    'zh-cn': '接口负载过高！',
    'en': 'Api overload',
    showCode: false
  },



  /* 权限错误：30701-30708 */
  '70001': {
    'zh-cn': '抱歉，您没有访问权限！',
    'en': 'Access limited',
    showCode: false
  },
  '75001':{
    'zh-cn': '时间段与已有时间段重合',
    'en': 'Access limited',
    showCode: false
  },
  '75002':{
    'zh-cn': '已有课程签到，无法禁用',
    'en': 'Access limited',
    showCode: false
  },
  '75003':{
    'zh-cn': '已经签退过了',
    'en': 'Access limited',
    showCode: false
  },
  '75004':{
    'zh-cn': '不能签到该二维码',
    'en': 'Access limited',
    showCode: false
  },
  '75005':{
    'zh-cn': '不在签到时间内',
    'en': 'Access limited',
    showCode: false
  },
  '75006':{
    'zh-cn': '不在签退时间内',
    'en': 'Access limited',
    showCode: false
  },
  '75007':{
    'zh-cn': '不在签到名单内',
    'en': 'Access limited',
    showCode: false
  },
  '75008':{
    'zh-cn': '已经签到过了',
    'en': 'Access limited',
    showCode: false
  },
  '75009': {
    'zh-cn': '签到已开始',
    'en': 'sign in start',
    showCode: false
  },
  '75010': {
    'zh-cn': '存在相同代理',
    'en': 'have same agent type',
    showCode: false
  },
  
  '75011': {
    'zh-cn': '同时存在班级和自定义代理',
    'en': 'have classa and user agent',
    showCode: false
  },

  '75012': {
    'zh-cn': '扫码失败,该用户已请假,请联系老师修改考勤状态!',
    'en': 'Users have asked for leave',
    showCode: false
  },
  
  /* 组织错误：70001-79999 */
  '30701': {
    'zh-cn': '您已经加入该组织！',
    'en': 'Already joined the organization',
    showCode: false
  },
  '30702': {
    'zh-cn': '申请正审核中，请勿重复提交申请！',
    'en': 'Do not submit an application repeatedly during the application for review',
    showCode: false
  },
  '30703': {
    'zh-cn': '查询不到申请信息或申请状态已变更！',
    'en': 'Cannot find application information or application status has changed',
    showCode: false
  },
  '30704': {
    'zh-cn': '该申请已撤回！',
    'en': 'The application has been withdrawn',
    showCode: false
  },
  '30705': {
    'zh-cn': '该申请已处理！',
    'en': 'The application has been processed',
    showCode: false
  },
  '30706': {
    'zh-cn': '该学生不是组织成员！',
    'en': 'The student is not a member of the organization',
    showCode: false
  },
  '30708': {
    'zh-cn': '不可移除指导老师！',
    'en': 'No removable instructor',
    showCode: false
  },
  // 公寓系统
  '1100001': {
    'zh-cn': '宿舍已有人入住',
    'en': 'The dormitory has been occupied',
    showCode: false
  },
  '1100002': {
    'zh-cn': '用户未入住',
    'en': 'User not staying',
    showCode: false
  },
  '1100003': {
    'zh-cn': '用户已经在批次中',
    'en': 'The user is already in the batch',
    showCode: false
  },
  '1100004': {
    'zh-cn': '用户不在批次中',
    'en': 'User is not in the batch',
    showCode: false
  },
  '1100005': {
    'zh-cn': '批次不存在',
    'en': 'Batch does not exist',
    showCode: false
  },
  '1100006': {
    'zh-cn': '用户已经选过房间了',
    'en': 'The user has already selected the room.',
    showCode: false
  },
  '1100007': {
    'zh-cn': '还未给该批次分配用户',
    'en': 'User has not been assigned to this batch',
    showCode: false
  },
  '1100008': {
    'zh-cn': '宿舍不在该批次中',
    'en': 'Dormitory is not in the lot',
    showCode: false
  },
  '1100009': {
    'zh-cn': '用户已经在其他批次中',
    'en': 'The user is already in another batch',
    showCode: false
  },
  '1100010': {
    'zh-cn': '批次已开始或者结束',
    'en': 'Batch has started or ended',
    showCode: false
  },
  '1100011': {
    'zh-cn': '楼栋编号重复',
    'en': 'Duplicate building number',
    showCode: false
  },
  '1100012': {
    'zh-cn': '批次已有人员选过房',
    'en': 'Batch user had choose housing',
    showCode: false
  },
  '1100013': {
    'zh-cn': '所分配的楼栋房间性别属性和学生性别矛盾',
    'en': 'Housing attributte not accord user',
    showCode: false
  },
  '1100015': {
    'zh-cn': '该房间资产种类已存在',
    'en': 'The asset class of the room already exists',
    showCode: false
  },
  '1100014': {
    'zh-cn': '添加资产的楼层对应房间号不存在',
    'en': 'The asset class of the room already exists',
    showCode: false
  },
  '1100016': {
    'zh-cn': '资产种类名字长度不符',
    'en': 'The asset class of the room already exists',
    showCode: false
  },
  '1100017': {
    'zh-cn': '所选日期统计数据过期',
    'en': 'The asset class of the room already exists',
    showCode: false
  },
  '1100018': {
    'zh-cn': '所选日期暂无统计数据',
    'en': 'The asset class of the room already exists',
    showCode: false
  },
  '1100019': {
    'zh-cn': '房源已分配完毕，不必收回房源',
    'en': 'The asset class of the room already exists',
    showCode: false
  },
  '1100020': {
    'zh-cn': '批次已经开始，无法回收房源',
    'en': 'The asset class of the room already exists',
    showCode: false
  },
  '1100021': {
    'zh-cn': '批次未结束，无法回收房源',
    'en': 'The asset class of the room already exists',
    showCode: false
  },
  '1100022': {
    'zh-cn': '该床位已被分配',
    'en': 'The asset class of the room already exists',
    showCode: false
  },
  '1100023': {
    'zh-cn': '所分配的楼栋房间学院属性和学生矛盾',
    'en': 'The asset class of the room already exists',
    showCode: false
  },
  // 就业系统用户相关
  // 就业系统登陆相关
  '31000': {
    'zh-cn': '您输入的密码和账号不匹配',
    showCode: false
  },
  '31001': {
    'zh-cn': '您已被管理员拉入黑名单',
    showCode: false
  },
  '31002': {
    'zh-cn': '账号激活链接已过期',
    showCode: false
  },
  '31004': {
    'zh-cn': '该邮箱已被使用,请更换邮箱',
    showCode: false
  },
  '31005': {
    'zh-cn': '该邮箱已激活',
    showCode: false
  },
  '31006': {
    'zh-cn': '验证码已过期',
    showCode: false
  },
  '30709': {
    'zh-cn': '查询不到该成员的党组织',
    showCode: false
  },
  '31007': {
    'zh-cn': '验证码输入错误',
    showCode: false
  },
  '31008': {
    'zh-cn': '验证码已失效',
    showCode: false
  },
  '31009': {
    'zh-cn': '密码设置链接已过期',
    showCode: false
  },
  '31010': {
    'zh-cn': '拼图验证失败',
    showCode: false
  },
  '31011': {
    'zh-cn': '密码错误超出当日限制,无法登录',
    showCode: false
  },
  // 招生系统相关
  '32000': {
    'zh-cn': '批次已存在请重新创建',
    'en': 'batch already existed!'
  },
  '32021': {
    'zh-cn': '该行程在新增时候不能保存',
    'en': 'batch already existed!'
  },
  '32002': {
    'zh-cn': '该批次已有录取学生，不能删除',
    'en': 'Students in this Batch,can not delete !'
  },
  '32003': {
    'zh-cn': '暂未查到相关录取信息！',
    'en': 'No find record!'
  },
  '32004': {
    'zh-cn': '已过查询有效期！',
    'en': 'Time out!'
  },
  '32005': {
    'zh-cn': '信息填写有误，请核对注意事项！',
    'en': 'Error message,notice please!'
  },
  '32010': {
    'zh-cn': '暂无符合条件的记录',
    'en': 'No eligible records!'
  },
  '32008': {
    'zh-cn': '请勿重复提交申请审核！',
    'en': 'Do not submit repeatedly!'
  },
  '32009': {
    'zh-cn': '开始时间不能大于结束时间',
    'en': 'The start time should be smoller than end time!'
  },
  '32011': {
    'zh-cn': '暂无相关数据请重新选择',
    'en': 'Please re-select if there is no relevant data yet.!'
  },
  '32012': {
    'zh-cn': '组别名称重复请重新输入',
    'en': 'Name repeatedly!'
  },
  '32013': {
    'zh-cn': '暂未查询到相关档案信息',
    'en': 'No relevant archival information has been queried yet!'
  },
  '32014': {
    'zh-cn': '该条行程状态不能修改',
    'en': 'The itinerary status cannot be modified!'
  },
  '30015': {
    'zh-cn': '请勿重复登记',
    'en': 'No register repeatedly'
  },
  '32022': {
    'zh-cn': '只能上传zip格式',
    'en': 'No register repeatedly'
  },
  '32023': {
    'zh-cn': 'zip压缩包内不能包含文件夹',
    'en': 'No register repeatedly'
  },
  // 内容管理相关
  '33301': {
    'zh-cn': '导航数量达到上限，不可新增',
    showCode: false
  },
  '33302': {
    'zh-cn': '顶部导航标题限五个汉字',
    showCode: false
  },
  '33303': {
    'zh-cn': '导航标题已存在',
    showCode: false
  },
  '33304': {
    'zh-cn': '父导航不存在',
    showCode: false
  },
  '33305': {
    'zh-cn': '底部导航标题限20个汉字',
    showCode: false
  },
  '33306': {
    'zh-cn': '模块标题已存在',
    showCode: false
  },
  '33307': {
    'zh-cn': '子模块标题限4个汉字',
    showCode: false
  },
  '33308': {
    'zh-cn': '父模块不存在',
    showCode: false
  },
  '33309': {
    'zh-cn': '所属系统不存在',
    showCode: false
  },
  '33310': {
    'zh-cn': '子模块数量达到上限，不可新增',
    showCode: false
  },
  '33311': {
    'zh-cn': '链接标题已存在',
    showCode: false
  },
  '33312': {
    'zh-cn': '链接数量达到上限，不可新增',
    showCode: false
  },

  //学习打卡
  '37501': {
    'zh-cn': '最多只能添加六个！',
    showCode: false
  },
  '37502': {
    'zh-cn': '您已答过本题',
    showCode: false
  },
  '37503': {
    'zh-cn': '题目已分配给学生答题,不允许操作',
    showCode: false
  },
  '37505': {
    'zh-cn': '当前学号已存在！',
    showCode: false
  },
  '37506': {
    'zh-cn': '当前不允许新增学生账号！',
    showCode: false
  },
  '37507': {
    'zh-cn': '未发布',
    showCode: false
  },
  '37510': {
    'zh-cn': '无答题打卡规则',
    showCode: false
  },
  '37511': {
    'zh-cn': '需要先学习打卡',
    showCode: false
  },
  '37512': {
    'zh-cn': '今日答题打卡无此题',
    showCode: false
  },
  '37531': {
    'zh-cn': '题目编号已存在',
    showCode: false
  },
  '37530': {
    'zh-cn': '该试卷ID已存在',
    showCode: false
  },
  '37532': {
    'zh-cn': '参考答案不在选项范围',
    showCode: false
  },
  '37533': {
    'zh-cn': 'slogan长度不能大于30,简介长度不能大于70',
    showCode: false
  },
  '37534': {
    'zh-cn': '该试卷没有题目,不能发布',
    showCode: false
  },
  '37535': {
    'zh-cn': '已关联课程或题目,不能删除',
    showCode: false
  },
  '37536': {
    'zh-cn': '单选题答案不能超过一个',
    showCode: false
  },
  '37537': {
    'zh-cn': '课程类别已存在',
    showCode: false
  },
  '37538': {
    'zh-cn': '课程编号已存在',
    showCode: false
  },
  // 就业系统业务相关
  '41001': {
    'zh-cn': '统一社会信用代码已存在',
    showCode: false
  },
  '41004': {
    'zh-cn': '单位不存在或者未完善信息',
    showCode: false
  },
  '41005': {
    'zh-cn': '单位未填写接受简历邮箱',
    showCode: false
  },
  '41006': {
    'zh-cn': '不在单位接受简历时间范围',
    showCode: false
  },
  '41007': {
    'zh-cn': '单位未完善登录信息',
    showCode: false
  },
  '41008': {
    'zh-cn': '邮箱不合法',
    showCode: false
  },
  '41009': {
    'zh-cn': '邮件发送失败',
    showCode: false
  },
  '63003': {
    'zh-cn': '文件不存在',
    showCode: false
  },
  // 就业系统招聘相关
  '51004': {
    'zh-cn': '招聘信息不存在',
    showCode: false
  },
  '51005': {
    'zh-cn': '单位账号被停用,无法操作招聘信息',
    showCode: false
  },
  // 场地相关
  '61001': {
    'zh-cn': '场地可用时间段重叠',
    showCode: false
  },
  '61002': {
    'zh-cn': '场地可用时间段前后时间必须为同一天',
    showCode: false
  },
  '61003': {
    'zh-cn': '该时间段已被申请成功或者正在申请中',
    showCode: false
  },
  '70002': {
    'zh-cn': '请登录后查看',
    showCode: false
  },
  // 申请限制
  '71001': {
    'zh-cn': '限制时间段有重叠',
    showCode: false
  },
  '90001': {
    'zh-cn': '请勿重复登记',
    showCode: false
  },

  '71002': {
    'zh-cn': '申请数量已达上限',
    showCode: false
  },
  // 网招会
  '72001': {
    'zh-cn': '单位已经申请过此网招会',
    showCode: false
  },
  '72002': {
    'zh-cn': '当前不处于此网招会的申请时间，无法申请',
    showCode: false
  },
  '72003': {
    'zh-cn': '网招会不存在',
    showCode: false
  },
  // 就业系统双选会
  '81001': {
    'zh-cn': '展位已被申请或占用',
    showCode: false
  },
  '81002': {
    'zh-cn': '已申请成功过该双选会',
    showCode: false
  },
  '81003': {
    'zh-cn': '当前不处于此双选会的申请时间，无法申请',
    showCode: false
  },
  '81004': {
    'zh-cn': '该双选会已下架，无法申请',
    showCode: false
  },
  '81005': {
    'zh-cn': '该双选会不允许选择展位',
    showCode: false
  },
  '81006': {
    'zh-cn': '该双选会已发布',
    showCode: false
  },
  '81007': {
    'zh-cn': '该展位名已存在',
    showCode: false
  },
  '81008': {
    'zh-cn': '该展位排序值已存在',
    showCode: false
  },
  '81009': {
    'zh-cn': '展位不存在',
    showCode: false
  },
  '81010': {
    'zh-cn': '双选会不存在',
    showCode: false
  },
  '81011': {
    'zh-cn': '双选会名称已存在',
    showCode: false
  },
  '81012': {
    'zh-cn': '参展单位不存在',
    showCode: false
  },
  '82001': {
    'zh-cn': '该职位当天您投递的次数已达到上限，无法再次投递',
    showCode: false
  },
  '82002': {
    'zh-cn': '应用数量已达上限',
    showCode: false
  },
  '82003': {
    'zh-cn': '应用已存在',
    showCode: false
  },
  '82004': {
    'zh-cn': '不是学生，无法报名',
    showCode: false
  },
  '82005': {
    'zh-cn': '会议已结束，无法报名',
    showCode: false
  },
  '82006': {
    'zh-cn': '已报名，不可重复报名',
    showCode: false
  },
  '82007': {
    'zh-cn': '会议已结束，无法取消',
    showCode: false
  },
  '100004': {
    'zh-cn': '教室不存在',
    showCode: false
  },
  '100005': {
    'zh-cn': '人员已经在黑名单中',
    showCode: false
  },
  '100006': {
    'zh-cn': '预约不存在',
    showCode: false
  },
  '100007': {
    'zh-cn': '预约未通过审核',
    showCode: false
  },
  '100008': {
    'zh-cn': '预约未审核',
    showCode: false
  },
  '100009': {
    'zh-cn': '预约未审核',
    showCode: false
  },
  '100010': {
    'zh-cn': '不在签到时间内',
    showCode: false
  },
  '100011': {
    'zh-cn': '不属于小组成员',
    showCode: false
  },
  '100012': {
    'zh-cn': '不在可预约时间内，无法预约！',
    showCode: false
  },
  '100013': {
    'zh-cn': '不符合预约规则!',
    showCode: false
  },
  '100014': {
    'zh-cn': '不符合预约规则!',
    showCode: false
  },
  '100015': {
    'zh-cn': '不在可预约时间段内',
    showCode: false
  },
  '100016': {
    'zh-cn': '教室开放时段有重叠',
    showCode: false
  },
  '100017': {
    'zh-cn': '不能对过去的时间排班',
    showCode: false
  }
}
const SUCCESS = '88888'
const NOT_FOUND = '50001'
module.exports = {
  getCodeInfo: (body, lang) => {
    if (!body) {
      return codes['apiLost'][(lang || 'zh-cn')]
    }
    if (!codes[body.code]) {
      return '异常码' + body.code ? body.code : ''
    }
    var codeStr = (codes[body.code].showCode ? (body.code + ':') : '') + codes[body.code][(lang || 'zh-cn')]
    return codeStr
  },
  success: SUCCESS,
  notFound: NOT_FOUND
}
