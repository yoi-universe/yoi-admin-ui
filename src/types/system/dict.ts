export interface DictTypeInfo {
  /* 字典id */
  dictId: number

  /* 字典名称 */
  dictName: string

  /* 字典类型 */
  dictType: string

  /* 状态（0正常 1停用） */
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

export interface DictDataInfo {
  /* 字典编码 */
  dictCode: number

  /* 字典标签 */
  dictLabel: string

  /* 字典键值 */
  dictValue: string

  /* 字典类型 */
  dictType: string

  /* 样式属性（其他样式扩展） */
  cssClass: string

  /* 表格回显样式 */
  listClass: string

  /* 是否默认[0:否;1:是] */
  isDefault: number

  /* 状态（0正常 1停用） */
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
