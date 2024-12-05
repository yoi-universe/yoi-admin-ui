import type { Directive, DirectiveBinding } from 'vue'

/**
 * 防抖指令
 * 使用：
 *  v-debounce:500="method"
 *  第一个参数是时间，单位是毫秒，第二个参数是回调函数
 */
const debounce: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const delay = parseInt(binding.arg || '500')
    const fn = binding.value
    let timer: number | null = null

    el.addEventListener(
      'click',
      () => {
        clearTimeout(timer!)
        timer = setTimeout(() => {
          fn()
        }, delay)
      },
      {
        passive: false,
      },
    )
  },
}

export default debounce
