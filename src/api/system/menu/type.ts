import type { MenuInfo } from '@/types/system/menu'

export interface GetMenuListParams {
  menuName?: string
  status?: number | null
  perms?: string
}

type OmitParams =
  | 'createBy'
  | 'createTime'
  | 'updateBy'
  | 'updateTime'
  | 'remark'
export interface AddMenuInfoParams
  extends Omit<MenuInfo, OmitParams | 'menuId'> {}

export interface UpdateMenuInfoParams extends Omit<MenuInfo, OmitParams> {}
