export interface PageParams {
  pageNum: number
  pageSize: number
  orderByColumn?: string
  isAsc?: string
  reasonable?: boolean
}

export interface PageInfo<T> {
  /* 总数 */
  total: number

  /* 数据列表 */
  list: T[]

  /* 当前页 */
  pageNum: number

  /* 每页的数量 */
  pageSize: number

  /* 总页数 */
  size: number

  /* 起始行 */
  startRow: number

  /* 结束行 */
  endRow: number

  /* 总页数 */
  pages: number

  /* 上一页 */
  prePage: number

  /* 下一页 */
  nextPage: number

  /* 是否为第一页 */
  isFirstPage: boolean

  /* 是否为最后一页 */
  isLastPage: boolean

  /* */
  hasPreviousPage: boolean

  /* */
  hasNextPage: boolean

  /* */
  navigatePages: number

  /* */
  navigatepageNums: string[]

  /* */
  navigateFirstPage: number

  /* */
  navigateLastPage: number
}
