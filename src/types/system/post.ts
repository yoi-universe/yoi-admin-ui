export interface PostInfo {
  /* 岗位id */
  postId: number

  /* 岗位编码 */
  postCode: string

  /* 岗位名称 */
  postName: string

  /* 状态（0正常 1停用） */
  status: number

  /* 排序 */
  sortNum: number

  /* 创建者  */
  createBy: string

  /* 创建时间 */
  createTime: Record<string, unknown>

  /* 更新者 */
  updateBy: string

  /* 更新时间 */
  updateTime: Record<string, unknown>

  /* 备注 */
  remark: string
}
