import { ElMessage } from 'element-plus'

/**
 * el-message 成功提示
 * @param message 消息文字
 * @param plain 是否纯色
 * @param dangerouslyUseHTMLString 是否将 message 属性作为 HTML 片段处理
 */
export function elMsgSuccess(
  message: string,
  plain: boolean = true,
  dangerouslyUseHTMLString: boolean = false,
) {
  ElMessage.closeAll()
  ElMessage({
    type: 'success',
    message,
    showClose: true,
    plain,
    dangerouslyUseHTMLString,
  })
}

/**
 * el-message 错误提示
 * @param message 消息文字
 * @param plain 是否纯色
 * @param dangerouslyUseHTMLString 是否将 message 属性作为 HTML 片段处理
 */
export function elMsgError(
  message: string,
  plain: boolean = true,
  dangerouslyUseHTMLString: boolean = false,
) {
  ElMessage.closeAll()
  ElMessage({
    type: 'error',
    message,
    showClose: true,
    plain,
    dangerouslyUseHTMLString,
  })
}
