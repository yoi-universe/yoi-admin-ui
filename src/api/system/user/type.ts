import type { PageParams } from '@/types/page'
import type { UserInfo } from '@/types/system/user'

export interface GetUserListParams extends PageParams {
  userName?: string
  nickName?: string
  phone?: string
  deptId?: number | null
}

type OmitParams =
  | 'createBy'
  | 'createTime'
  | 'updateBy'
  | 'updateTime'
  | 'remark'
export interface AddUserInfoParams
  extends Omit<UserInfo, OmitParams | 'deptId'> {}

export interface UpdateUserInfoParams extends Omit<UserInfo, OmitParams> {}
