export interface DeptInfo {
  /* 部门id */
  deptId: number

  /* 父部门id */
  parentId: number

  /* 部门名称 */
  deptName: string

  /* 负责人 */
  leader: string

  /* 联系电话 */
  phone: string

  /* 邮箱 */
  email: string

  /* 部门状态:1正常,2停用 */
  status: number

  /* 显示顺序 */
  sortNum: number

  /* 创建者 */
  createBy: string

  /* 创建时间 */
  createTime: string

  /* 更新者 */
  updateBy: string

  /* 更新时间 */
  updateTime: string

  /* 备注 */
  remark: string
}

export interface DeptTree extends DeptInfo {
  children: DeptTree[]
}
