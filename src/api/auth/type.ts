import type { MenuInfo } from '@/types/system/menu'
import type { UserInfo } from '@/types/system/user'

export interface LoginParams {
  userName: string
  password: string
  captcha: string
  key: string
}

export interface LoginRes {
  token: string
}

export interface UserInfoRes {
  /* 登录用户信息 */
  loginUser: UserInfo

  /* 用户角色 */
  roleKeys: string[]

  /* 用户权限 */
  permissions: string[]
}

export type MenuInfoRes = MenuInfo[]

export interface PersonalData {
  /* 登录账号 */
  userName: string

  /* 昵称 */
  nickName: string

  /* 邮箱 */
  email: string

  /* 手机号码 */
  phone: string

  /* 头像 */
  avatar: string

  /* 性别 */
  sex: number

  /* 部门名称 */
  deptName: string

  /* 角色名称 */
  roleName: string

  /* 状态 */
  createTime: string
}

type OmitParams = 'createTime' | 'userName' | 'deptName' | 'roleName'
export type UpdatePersonalDataParams = Partial<Omit<PersonalData, OmitParams>>

export interface UpdatePasswordParams {
  password: string
  newPassword: string
  confirmPassword: string
}
