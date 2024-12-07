<template>
  <YoiDialog
    ref="yoiDialogRef"
    title="分配菜单"
    :width="400"
    :loading="loading"
    :btn-loading="btnLoading"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <template #content>
      <div>
        <el-tree
          ref="treeRef"
          :data="treeData"
          show-checkbox
          :default-expand-all="false"
          node-key="menuId"
          highlight-current
          :props="{
            id: 'menuId',
            label: 'menuName',
            children: 'children',
          }"
        />
      </div>
    </template>
  </YoiDialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import YoiDialog from '@/components/YoiDialog/index.vue'
import {
  assignRoleMenuApi,
  getNormalMenuListApi,
  getRoleMenuListApi,
} from '@/api/system/role'
import type { ElTree } from 'element-plus'

const loading = ref(false)
const btnLoading = ref(false)
const roleId = ref(0)
const treeRef = ref<InstanceType<typeof ElTree>>()
const treeData = ref([])

const getData = async () => {
  loading.value = true
  const normalMenuListRes = await getNormalMenuListApi().catch(e => e)
  if (normalMenuListRes.code === 200) {
    treeData.value = normalMenuListRes.data
  }
  const roleMenuListRes = await getRoleMenuListApi(roleId.value).catch(e => e)
  if (roleMenuListRes.code === 200) {
    treeRef.value?.setCheckedKeys(roleMenuListRes.data, false)
  }
  loading.value = false
}

const resetForm = () => {
  roleId.value = 0
}
const yoiDialogRef = ref()
const emit = defineEmits(['confirm'])
const handleConfirm = async () => {
  btnLoading.value = true
  console.log('submit!')
  const menuIds = treeRef.value?.getCheckedKeys() as number[]
  const halfMenuIds = treeRef.value?.getHalfCheckedKeys() as number[]
  const finalKey: number[] = halfMenuIds.concat(menuIds)
  const result = await assignRoleMenuApi(roleId.value, finalKey).catch(e => e)
  if (result.code === 200) {
    yoiDialogRef.value.confirmClose()
    emit('confirm')
  }
  btnLoading.value = false
}
const handleCancel = () => {
  yoiDialogRef.value.close()
}
const open = (id: number) => {
  yoiDialogRef.value.open()
  resetForm()
  roleId.value = id
  getData()
}

defineExpose({
  open,
})
</script>

<style scoped></style>
