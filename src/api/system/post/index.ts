import yoiAxios from '@/api/yoiAxios'
import type {
  AddPostInfoParams,
  GetPostListParams,
  UpdatePostInfoParams,
} from './type'
import type { PostInfo } from '@/types/system/post'
import type { PageInfo } from '@/types/page'

const prefix = '/sys_post'

enum Api {
  list = prefix + '/list',
  add = prefix + '/add',
  update = prefix + '/update',
  delete = prefix + '/delete',
  getInfo = prefix + '/get_info',
}

/**
 * 获取岗位列表
 * @param params 查询参数
 * @returns Promise
 */
export function getPostListApi(params: GetPostListParams) {
  return yoiAxios.get<PageInfo<PostInfo>>(Api.list, params)
}

/**
 * 新增岗位
 * @param data 新增参数
 * @returns Promise
 */
export function addPostApi(data: AddPostInfoParams) {
  return yoiAxios.post(Api.add, data, { showCodeMessage: true })
}

/**
 * 更新岗位
 * @param data 更新参数
 * @returns Promise
 */
export function updatePostApi(data: UpdatePostInfoParams) {
  return yoiAxios.put(Api.update, data, { showCodeMessage: true })
}

/**
 * 删除岗位
 * @param postIds 岗位id数组
 * @returns Promise
 */
export function deletePostApi(postIds: number[]) {
  return yoiAxios.delete(Api.delete, postIds, { showCodeMessage: true })
}

/**
 * 获取岗位信息
 * @param postId 岗位id
 * @returns Promise
 */
export function getPostInfoApi(postId: number) {
  return yoiAxios.get<PostInfo>(Api.getInfo, { postId })
}
