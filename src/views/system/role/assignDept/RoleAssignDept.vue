<template>
  <YoiDialog
    ref="yoiDialogRef"
    title="分配数据权限"
    :width="400"
    :loading="loading"
    :btn-loading="btnLoading"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <template #content>
      <el-form ref="formRef" :rules="rules" :model="form" label-width="auto">
        <el-row>
          <el-col :xs="{ span: 24 }" :sm="{ span: 24 }">
            <!-- 权限范围 -->
            <el-form-item label="权限范围" prop="dataScope">
              <el-select v-model="form.dataScope" placeholder="请输入权限范围">
                <el-option label="全部数据权限" :value="0" />
                <el-option label="自定义数据权限" :value="1" />
                <el-option label="本部门数据权限" :value="2" />
                <el-option label="本部门及以下数据权限" :value="3" />
                <el-option label="仅本人数据权限" :value="4" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col
            :xs="{ span: 24 }"
            :sm="{ span: 24 }"
            v-if="form.dataScope === 1"
          >
            <!-- 部门树 -->
            <el-form-item label=" ">
              <el-tree
                ref="treeRef"
                :data="treeData"
                show-checkbox
                style="width: 100%; height: 100%"
                :default-expand-all="false"
                node-key="deptId"
                highlight-current
                :props="{
                  id: 'deptId',
                  label: 'deptName',
                  children: 'children',
                }"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!--  -->
      </el-form>
    </template>
  </YoiDialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import YoiDialog from '@/components/YoiDialog/index.vue'
import type { ElTree, FormInstance } from 'element-plus'
import type { AssignRoleDeptParams } from '@/api/system/role/type'
import {
  assignDataAuthApi,
  getNormalDeptListApi,
  getRoleDeptListApi,
  getRoleInfoApi,
} from '@/api/system/role'

const loading = ref(false)
const btnLoading = ref(false)
const treeRef = ref<InstanceType<typeof ElTree>>()
const treeData = ref([])
const formRef = ref<FormInstance>()
const form = ref<AssignRoleDeptParams>({
  roleId: 0,
  dataScope: 0,
  deptIds: [],
})
const rules = reactive({
  dataScope: [{ required: true, message: '请选择权限范围', trigger: 'blur' }],
})

const getData = async () => {
  loading.value = true
  const normalDeptListRes = await getNormalDeptListApi().catch(e => e)
  if (normalDeptListRes.code === 200) {
    treeData.value = normalDeptListRes.data
  }
  const roleInfoRes = await getRoleInfoApi(form.value.roleId).catch(e => e)
  if (roleInfoRes.code === 200) {
    form.value.roleId = roleInfoRes.data.roleId
    form.value.dataScope = roleInfoRes.data.dataScope
  }
  const roleDeptListRes = await getRoleDeptListApi(form.value.roleId).catch(
    e => e,
  )
  if (roleDeptListRes.code === 200) {
    treeRef.value?.setCheckedKeys(roleDeptListRes.data, false)
  }
  loading.value = false
}

const resetForm = () => {
  form.value = {
    roleId: 0,
    dataScope: 0,
    deptIds: [],
  }
  if (formRef.value) {
    formRef.value.resetFields()
  }
}
const yoiDialogRef = ref()
const emit = defineEmits(['confirm'])
const handleConfirm = async () => {
  btnLoading.value = true
  console.log('submit!')
  if (form.value.dataScope === 1) {
    const deptIds = treeRef.value?.getCheckedKeys() as number[]
    const halfDeptIds = treeRef.value?.getHalfCheckedKeys() as number[]
    const finalKey: number[] = halfDeptIds.concat(deptIds)
    form.value.deptIds = finalKey
  }
  const result = await assignDataAuthApi(form.value).catch(e => e)
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
  form.value.roleId = id
  getData()
}

defineExpose({
  open,
})
</script>

<style scoped></style>
