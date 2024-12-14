/**
 * 用户信息
 */
export interface UserInfo {
  /* 用户id */
  userId: number

  /* 部门id */
  deptId: number

  /* 登录账号 */
  userName: string

  /* 昵称 */
  nickName: string

  /* 账号类型 */
  userType: number

  /* 手机号码 */
  phone: string

  /* 邮箱 */
  email: string

  /* 性别 */
  sex: number

  /* 头像 */
  avatar: string

  /* 状态 */
  status: number

  /* 删除标志 */
  delFlag?: number

  /* 登录ip */
  loginIp?: string

  /* 登录时间 */
  loginDate?: string

  /* 排序 */
  sortNum: number

  /* 创建者 */
  createBy?: string

  /* 创建时间 */
  createTime?: string

  /* 更新者 */
  updateBy?: string

  /* 更新时间 */
  updateTime?: string

  /* 备注 */
  remark?: string

  /* 部门名称 */
  deptName?: string
}
