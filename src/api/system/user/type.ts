import type { PageParams } from '@/types/page'
import type { UserInfo } from '@/types/system/user'

export interface GetUserListParams extends PageParams {
  userName?: string
  nickName?: string
  phone?: string
  deptId?: number | null
}

type OmitParams = 'createBy' | 'createTime' | 'updateBy' | 'updateTime'
export interface AddUserInfoParams
  extends Omit<UserInfo, OmitParams | 'userId'> {
  password: string
  postIds: number[]
  roleIds: number[]
}

export interface UpdateUserInfoParams extends Omit<UserInfo, OmitParams> {
  password: string
  postIds: number[]
  roleIds: number[]
}
