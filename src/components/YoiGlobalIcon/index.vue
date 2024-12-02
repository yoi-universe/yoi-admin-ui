<template>
  <el-icon :size="size">
    <component :is="icon ? icon : 'Sunny'"></component>
  </el-icon>
</template>

<script lang="ts" setup>
const { icon, size = 18 } = defineProps<Props>()
</script>
<script lang="ts">
interface Props {
  icon?: string
  size?: number | string
}
</script>

<style scoped></style>
