import type { PageParams } from '@/types/page'
import type { PostInfo } from '@/types/system/post'

export interface GetPostListParams extends PageParams {
  postName?: string
  postCode?: string
  status?: number | null
}

type OmitParams =
  | 'createBy'
  | 'createTime'
  | 'updateBy'
  | 'updateTime'
  | 'remark'
export interface AddPostInfoParams
  extends Omit<PostInfo, OmitParams | 'deptId'> {}

export interface UpdatePostInfoParams extends Omit<PostInfo, OmitParams> {}
