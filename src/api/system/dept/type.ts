import type { DeptInfo } from '@/types/system/dept'

export interface GetDeptListParams {
  deptName?: string
  phone?: string
  status?: number | null
}

type OmitParams = 'createBy' | 'createTime' | 'updateBy' | 'updateTime'
export interface AddDeptInfoParams
  extends Omit<DeptInfo, OmitParams | 'deptId'> {}

export interface UpdateDeptInfoParams extends Omit<DeptInfo, OmitParams> {}
