import type { Directive, DirectiveBinding } from 'vue'

/**
 * 节流指令
 * 使用：
 * v-throttle:500="method"
 * 第一个参数是时间，单位是毫秒，第二个参数是回调函数
 */
const throttle: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const delay = parseInt(binding.arg || '500')
    const fn = binding.value
    let lastTime = 0

    el.addEventListener(
      'click',
      () => {
        const time = new Date().getTime()
        if (time - lastTime > delay) {
          fn()
          lastTime = time
        }
      },
      {
        passive: false,
      },
    )
  },
}

export default throttle
