<template>
  <el-icon :size="size">
    <component v-if="icon" :is="icon"></component>
  </el-icon>
</template>

<script lang="ts" setup>
const { icon = 'Sunny', size = 18 } = defineProps<Props>()
</script>
<script lang="ts">
interface Props {
  icon?: string
  size?: number | string
}
</script>

<style scoped></style>
