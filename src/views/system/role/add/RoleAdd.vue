<template>
  <YoiDialog
    ref="yoiDialogRef"
    title="添加角色"
    :btn-loading="btnLoading"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <template #content>
      <el-form ref="formRef" :rules="rules" :model="form" label-width="auto">
        <el-row>
          <el-col :xs="{ span: 24 }" :sm="{ span: 12 }">
            <!-- 角色名称 -->
            <el-form-item label="角色名称" prop="roleName">
              <el-input
                v-model="form.roleName"
                placeholder="请输入角色名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="{ span: 24 }" :sm="{ span: 12 }" class="pl-10px">
            <!-- 角色编号 -->
            <el-form-item label="角色编号" prop="roleKey">
              <el-input
                v-model="form.roleKey"
                placeholder="请输入角色编号"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :xs="{ span: 24 }" :sm="{ span: 12 }">
            <!-- 角色状态 -->
            <el-form-item label="角色状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择角色状态">
                <el-option label="启用" :value="0" />
                <el-option label="停用" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="{ span: 24 }" :sm="{ span: 12 }" class="pl-10px">
            <el-form-item label="排序" prop="sortNum">
              <el-input-number v-model="form.sortNum" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :xs="{ span: 24 }" :sm="{ span: 24 }">
            <!-- 角色备注 -->
            <el-form-item label="角色备注" prop="remark">
              <el-input
                v-model="form.remark"
                :rows="5"
                type="textarea"
                placeholder="请输入角色备注"
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
import { nextTick, reactive, ref } from 'vue'
import YoiDialog from '@/components/YoiDialog/index.vue'
import type { FormInstance } from 'element-plus'
import type { AddRoleInfoParams } from '@/api/system/role/type'
import { addRoleApi } from '@/api/system/role'

const btnLoading = ref(false)
const formRef = ref<FormInstance>()
const form = ref<AddRoleInfoParams>({
  roleName: '',
  roleKey: '',
  sortNum: 0,
  status: 0,
  remark: '',
})
const rules = reactive({
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  roleKey: [{ required: true, message: '请输入权限字符', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
  sortNum: [{ required: true, message: '请输入排序', trigger: 'blur' }],
})

const resetForm = () => {
  form.value = {
    roleName: '',
    roleKey: '',
    sortNum: 0,
    status: 0,
    remark: '',
  }
  if (formRef.value) {
    formRef.value.resetFields()
  }
}
const yoiDialogRef = ref()
const emit = defineEmits(['confirm'])
const handleConfirm = () => {
  if (!formRef.value) return
  formRef.value.validate(async valid => {
    if (valid) {
      btnLoading.value = true
      console.log('submit!')
      const result = await addRoleApi(form.value).catch(e => e)
      if (result.code === 200) {
        yoiDialogRef.value.confirmClose()
        emit('confirm')
      }
      btnLoading.value = false
    } else {
      console.log('error submit!')
    }
  })
}
const handleCancel = () => {
  yoiDialogRef.value.close()
}
const open = () => {
  yoiDialogRef.value.open()
  resetForm()
}

defineExpose({
  open,
})
</script>

<style scoped></style>
