import type { PageParams } from '@/types/page'
import type { PostInfo } from '@/types/system/post'

export interface GetPostListParams extends PageParams {
  postName?: string
  postCode?: string
  status?: number | null
}

type OmitParams = 'createBy' | 'createTime' | 'updateBy' | 'updateTime'
export interface AddPostInfoParams
  extends Omit<PostInfo, OmitParams | 'postId'> {}

export interface UpdatePostInfoParams extends Omit<PostInfo, OmitParams> {}
