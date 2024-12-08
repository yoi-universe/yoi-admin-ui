<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from './stores'

const i18n = useI18n()
const globalStore = useGlobalStore()

const locale = computed(() => {
  return (i18n.getLocaleMessage(globalStore.language) as any).langConfig
})
</script>

<template>
  <el-config-provider :locale="locale">
    <RouterView />
  </el-config-provider>
</template>

<style scoped></style>
