import type { Directive, DirectiveBinding } from 'vue'

/**
 * 节流
 * @param 延迟时间
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
