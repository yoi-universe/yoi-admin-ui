import type { PageParams } from '@/types/page'
import type { UserInfo } from '@/types/system/user'

export interface UserInfoRes extends UserInfo {
  postIds: number[]
  roleIds: number[]
}

export interface GetUserListParams extends PageParams {
  userName?: string
  nickName?: string
  phone?: string
  deptId?: number | null
}

type OmitParams = 'createBy' | 'createTime' | 'updateBy' | 'updateTime'
export interface AddUserInfoParams
  extends Omit<UserInfoRes, OmitParams | 'userId'> {
  password: string
}

export interface UpdateUserInfoParams extends Omit<UserInfoRes, OmitParams> {
  password: string
}
