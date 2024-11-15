/**
 * 获取资源文件路径
 *
 * @param url 资源文件路径，只需传入assets下的路径即可，例如：images/error/404.png
 * @returns 返回资源文件在本地文件系统中的路径
 */
export function getAssets(url: string) {
  return new URL(`../assets/${url}`, import.meta.url).href
}

/**
 * 递归构建树形结构
 *
 * @param items 数组类型的数据
 * @param parentId 当前节点的父节点ID，可选
 * @param parentIdField 父节点ID的字段名，默认为'parentId'
 * @param idField 当前节点的ID字段名，默认为'id'
 * @param childrenField 子节点的字段名，默认为'children'
 * @returns 返回树形结构数组
 */
export function recursiveTree<T, R extends T>(
  items: T[],
  parentId: number | number[],
  parentIdField = 'parentId',
  idField = 'menuId',
  childrenField = 'children',
) {
  const result: R[] = []
  for (const item of items) {
    if (
      (item as any)[parentIdField] === parentId ||
      (Array.isArray(parentId) &&
        parentId.includes((item as any)[parentIdField] as never))
    ) {
      const children: R[] = recursiveTree<T, R>(
        items,
        (item as any)[idField],
        parentIdField,
        idField,
        childrenField,
      )
      if (children.length) {
        ;(item as any)[childrenField] = children
      }
      result.push(item as R)
    }
  }
  return result
}
