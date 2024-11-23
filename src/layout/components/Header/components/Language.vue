<template>
  <div class="language">
    <el-tooltip content="翻译语言" placement="left">
      <el-dropdown @command="handleLanguage">
        <el-icon size=20>
          <SwitchFilled />
        </el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="item in langList()" :key="item.value" :command="item.value"
              :disabled="item.value === language">{{ item.content
              }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-tooltip>
  </div>
</template>

<script lang="ts" setup>
import { langList } from '@/languages/tools';
import { useGlobalStore } from '@/stores';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const globalStore = useGlobalStore()
const i18n = useI18n()

const language = computed(() => globalStore.language)

const handleLanguage = (lang: string) => {
  i18n.locale.value = lang;
  globalStore.setLanguage(lang)
}
</script>

<style lang="scss" scoped>
.language {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 5px;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }

  .el-icon:hover {
    color: var(--el-color-primary);
  }

  // 解决el-dropdown获取到焦点或点击出现黑边情况
  :deep(.el-tooltip__trigger:focus-visible) {
    outline: unset;
  }
}
</style>
