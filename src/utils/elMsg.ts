import { ElMessage, type messageType } from 'element-plus'

/**
 * el-message 全局提示
 * @param message 消息文字
 * @param type 类型
 * @param duration 持续时间
 * @param plain 是否纯色
 * @param dangerouslyUseHTMLString 是否将 message 属性作为 HTML 片段处理
 */
export function elMsg(
  message: string,
  type: messageType = 'info',
  duration: number = 3000,
  plain: boolean = true,
  dangerouslyUseHTMLString: boolean = false,
) {
  ElMessage.closeAll()
  ElMessage({
    type,
    message,
    duration,
    showClose: true,
    plain,
    dangerouslyUseHTMLString,
  })
}

/**
 * el-message 成功提示
 * @param message 消息文字
 * @param duration 持续时间
 * @param plain 是否纯色
 * @param dangerouslyUseHTMLString 是否将 message 属性作为 HTML 片段处理
 */
export function elMsgSuccess(
  message: string,
  duration: number = 3000,
  plain: boolean = true,
  dangerouslyUseHTMLString: boolean = false,
) {
  ElMessage.closeAll()
  ElMessage({
    type: 'success',
    message,
    duration,
    showClose: true,
    plain,
    dangerouslyUseHTMLString,
  })
}

/**
 * el-message 错误提示
 * @param message 消息文字
 * @param duration 持续时间
 * @param plain 是否纯色
 * @param dangerouslyUseHTMLString 是否将 message 属性作为 HTML 片段处理
 */
export function elMsgError(
  message: string,
  duration: number = 3000,
  plain: boolean = true,
  dangerouslyUseHTMLString: boolean = false,
) {
  ElMessage.closeAll()
  ElMessage({
    type: 'error',
    message,
    duration,
    showClose: true,
    plain,
    dangerouslyUseHTMLString,
  })
}

export function elMsgWarning(
  message: string,
  duration: number = 3000,
  plain: boolean = true,
  dangerouslyUseHTMLString: boolean = false,
) {
  ElMessage.closeAll()
  ElMessage({
    type: 'warning',
    message,
    duration,
    showClose: true,
    plain,
    dangerouslyUseHTMLString,
  })
}
