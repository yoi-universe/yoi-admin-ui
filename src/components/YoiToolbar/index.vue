<template>
  <div class="yoi-toolbar">
    <el-row>
      <el-tooltip :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top">
        <el-button circle icon="search" @click="toggleSearch" />
      </el-tooltip>
      <el-tooltip content="刷新" placement="top">
        <el-button circle icon="refresh" @click="handleRefresh" />
      </el-tooltip>
    </el-row>
  </div>
</template>

<script lang="ts" setup>

const showSearch = defineModel('showSearch')
const emit = defineEmits(['refreshTable'])

const toggleSearch = () => {
  showSearch.value = !showSearch.value
}

const handleRefresh = () => {
  emit('refreshTable')
}
</script>

<style lang="scss" scoped>
.yoi-toolbar {
  margin-left: auto;
}
</style>
