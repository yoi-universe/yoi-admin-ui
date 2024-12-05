<template>
  <el-popover
    placement="bottom-start"
    v-model:visible="visible"
    :width="widthPopover"
    trigger="click"
  >
    <template #reference>
      <el-input
        v-model="modelValue"
        :style="{ width: width ? width + 'px' : '100%' }"
        placeholder="请选择图标"
        clearable
      >
        <template #append>
          <YoiGlobalIcon v-if="modelValue" :icon="modelValue" />
          <span v-else></span>
        </template>
      </el-input>
    </template>
    <template #default>
      <el-tabs>
        <el-tab-pane
          :label="item.name"
          v-for="(item, index) in iconTabs"
          :key="index"
          class="h-70"
        >
          <el-scrollbar>
            <div class="flex flex-wrap">
              <div
                v-for="(iconItem, iconIndex) in item.icons"
                :key="iconIndex"
                class="m-1"
              >
                <el-button @click="handleIconSelect(iconItem)">
                  <YoiGlobalIcon :icon="iconItem" size="18" />
                </el-button>
              </div>
            </div>
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
    </template>
  </el-popover>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import YoiGlobalIcon from '@/components/YoiGlobalIcon/index.vue'

const visible = ref(false)
const modelValue = defineModel<string>('modelValue')

const { width, widthPopover = 380 } = defineProps<Props>()

// ElementPlus图标库
const elementPlusIconList: string[] = []

// 获取ElementPlus所有图标
const getElementPlusIcon = () => {
  for (const name in ElementPlusIconsVue) {
    elementPlusIconList.push(name)
  }
  return elementPlusIconList
}

const iconTabs = [
  {
    name: 'ele图标',
    icons: getElementPlusIcon(),
  },
]

const handleIconSelect = (iconItem: string) => {
  modelValue.value = iconItem
  visible.value = false
}
</script>
<script lang="ts">
interface Props {
  width?: string | number
  widthPopover?: string | number
}
</script>

<style scoped></style>
