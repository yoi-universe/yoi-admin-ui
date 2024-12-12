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
