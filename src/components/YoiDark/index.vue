<template>
  <div class="dark">
    <span @click="handleSwitchDark">
      <slot name="dark"></slot>
    </span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const isDark = ref(false)

const switchTheme = () => {
  const html = document.documentElement
  if (isDark.value) html.classList.add('dark')
  else html.classList.remove('dark')
}

const handleSwitchDark = (event: MouseEvent) => {
  const x = event.clientX
  const y = event.clientY
  // 计算按钮到最远点的距离用作裁剪圆形的半径
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y)
  )

  if (document.startViewTransition == undefined) {
    console.log('你的浏览器不支持view transition')
    // 切换主题逻辑
    isDark.value = !isDark.value
    switchTheme()
  } else {
    const transition = document.startViewTransition(() => {
      // 切换主题逻辑
      isDark.value = !isDark.value
      switchTheme()
    })
    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];
      document.documentElement.animate(
        { clipPath: isDark.value ? clipPath : [...clipPath].reverse() },
        {
          duration: 400,
          easing: "ease-in",
          pseudoElement: isDark.value
            ? "::view-transition-new(root)"
            : "::view-transition-old(root)",
        }
      )
    })
  }

}
</script>

<style lang="scss">
/* 可选择的自定义动画样式 */
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root) {
  z-index: 9999;
}

::view-transition-new(root) {
  z-index: 1;
}

.dark::view-transition-old(root) {
  z-index: 1;
}

.dark::view-transition-new(root) {
  z-index: 9999;
}

.dark {
  // 颜色方案
  color-scheme: dark;
}
</style>
