export interface MenuInfo {
  /* 菜单id */
  menuId: number

  /* 父级菜单id */
  parentId: number

  /* 菜单名称 */
  menuName: string

  /* 路由地址 */
  path: string

  /* 路由名称 */
  routeName: string

  /* 组件路径 */
  component: string

  /* 路由参数 */
  query: string

  /* 是否外链 */
  isLink: number

  /* 外链类型 */
  linkType: number

  /* 外链地址 */
  linkUrl: string

  /* 是否缓存 */
  isCache: number

  /* 菜单类型 */
  menuType: number

  /* 权限标识 */
  perms: string

  /* 图标 */
  icon: string

  /* 是否可见 */
  visible: number

  /* 菜单状态 */
  status: number

  /* 排序 */
  sortNum: number

  /* 创建者 */
  createBy?: string

  /* 创建时间 */
  createTime?: string

  /* 修改者 */
  updateBy?: string

  /* 修改时间 */
  updateTime?: string

  /* 备注 */
  remark?: string
}

export interface MenuTree extends MenuInfo {
  children: MenuTree[]
}
