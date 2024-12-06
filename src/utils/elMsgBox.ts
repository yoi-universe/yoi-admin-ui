import { ElMessageBox } from 'element-plus'

type MessageType = '' | 'success' | 'warning' | 'info' | 'error'
export function elMsgBox(
  message: string = '您确定进行关闭么？',
  title: string = '温馨提示：',
  confirmButtonText: string = '确定',
  cancelButtonText: string = '取消',
  type: MessageType = 'warning',
  dangerouslyUseHTMLString: boolean = true,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(message, title, {
      confirmButtonText,
      cancelButtonText,
      type,
      draggable: true,
      dangerouslyUseHTMLString,
    })
      .then(() => {
        resolve(true)
      })
      .catch(() => {
        reject(false)
      })
  })
}
