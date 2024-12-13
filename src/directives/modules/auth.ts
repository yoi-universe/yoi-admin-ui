import { useAuthStore } from '@/stores'
import type { Directive, DirectiveBinding } from 'vue'

/**
 * v-auth
 * 按钮权限指令
 */
const auth: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value }: { value: string | string[] } = binding
    const authStore = useAuthStore()
    if (
      Array.isArray(value) &&
      value.some(item => !authStore.getPermissions.includes(item))
    ) {
      el.parentNode?.removeChild(el) // 如果用户不拥有所有权限，则移除元素
    }
    if (
      typeof value === 'string' &&
      !authStore.getPermissions.includes(value)
    ) {
      el.parentNode?.removeChild(el)
    }
  },
}

export default auth
