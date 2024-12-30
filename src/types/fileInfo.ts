export interface FileInfo {
  /* 文件id */
  fileId: number

  /* 文件原始名 */
  fileName: string

  /* 文件大小 */
  fileSize: number

  /* 文件后缀 */
  fileSuffix: string

  /* 文件类型 */
  fileType: number

  /* 新文件名 */
  newName: string

  /* 文件上传地址 */
  fileUpload: string

  /* 排序 */
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
