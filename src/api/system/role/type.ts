import type { PageParams } from '@/types/page'
import type { RoleInfo } from '@/types/system/role'

export interface GetRoleListParams extends PageParams {
  roleName?: string
  roleKey?: string
  status?: number | null
}

type OmitParams = 'createBy' | 'createTime' | 'updateBy' | 'updateTime'
export interface AddRoleInfoParams
  extends Omit<RoleInfo, OmitParams | 'roleId'> {}

export interface UpdateRoleInfoParams extends Omit<RoleInfo, OmitParams> {}

export interface AssignRoleDeptParams {
  roleId: number
  dataScope: number
  deptIds?: number[]
}
