export interface RoleInfo {
  /* 角色id */
  roleId: number

  /* 角色名称 */
  roleName: string

  /* 角色编号 */
  roleKey: string

  /* 角色状态:0正常,1停用 */
  status: number

  /* 显示顺序 */
  sortNum: number

  /* 创建者 */
  createBy?: string

  /* 创建时间 */
  createTime?: string

  /* 更新者 */
  updateBy?: string

  /* 更新时间 */
  updateTime?: string

  /* 备注 */
  remark?: string
}
