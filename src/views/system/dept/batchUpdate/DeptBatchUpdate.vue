<template>
  <YoiDialog
    ref="yoiDialogRef"
    title="修改部门"
    :loading="loading"
    :btn-loading="btnLoading"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    :height="400"
    :confirm-text="submitText"
  >
    <template #content>
      <el-form ref="formRef" :rules="rules" :model="form" label-width="auto">
        <el-row>
          <el-col :xs="{ span: 24 }" :sm="{ span: 24 }">
            <!-- 上级部门 -->
            <el-form-item label="上级部门" prop="parentId">
              <el-cascader
                placeholder="请选择上级部门"
                v-model="form.parentId"
                :options="deptTreeList"
                :props="{
                  expandTrigger: 'hover',
                  emitPath: false,
                  checkStrictly: true,
                  label: 'deptName',
                  value: 'deptId',
                }"
                filterable
                clearable
                style="width: 100%"
              >
                <template #default="{ node, data }">
                  <span>{{ data.deptName }}</span>
                  <span v-if="!node.isLeaf">
                    ({{ data.children.length }})
                  </span>
                </template>
              </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :xs="{ span: 24 }" :sm="{ span: 12 }">
            <!-- 部门名称 -->
            <el-form-item label="部门名称" prop="deptName">
              <el-input
                v-model="form.deptName"
                placeholder="请输入部门名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="{ span: 24 }" :sm="{ span: 12 }" class="pl-10px">
            <!-- 负责人 -->
            <el-form-item label="负责人" prop="leader">
              <el-input
                v-model="form.leader"
                placeholder="请输入负责人"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :xs="{ span: 24 }" :sm="{ span: 12 }">
            <!-- 联系电话 -->
            <el-form-item label="联系电话" prop="phone">
              <el-input
                v-model="form.phone"
                placeholder="请输入联系电话"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="{ span: 24 }" :sm="{ span: 12 }" class="pl-10px">
            <!-- 邮箱 -->
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="form.email"
                placeholder="请输入邮箱"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :xs="{ span: 24 }" :sm="{ span: 12 }">
            <!-- 部门状态 -->
            <el-form-item label="部门状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择部门状态">
                <el-option label="正常" :value="0" />
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
            <!-- 部门备注 -->
            <el-form-item label="部门备注" prop="remark">
              <el-input
                v-model="form.remark"
                :rows="5"
                type="textarea"
                placeholder="请输入部门备注"
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
import { computed, reactive, ref } from 'vue'
import YoiDialog from '@/components/YoiDialog/index.vue'
import type { FormInstance } from 'element-plus'
import type { DeptTree } from '@/types/system/dept'
import type { UpdateDeptInfoParams } from '@/api/system/dept/type'
import {
  getDeptInfoApi,
  getDeptSelectListApi,
  updateDeptApi,
} from '@/api/system/dept'
import { elMsgSuccess } from '@/utils/elMsg'

const currentIndex = ref(0)
const idList = ref<number[]>([])
const submitText = computed(() => {
  return currentIndex.value === idList.value.length - 1
    ? '确定'
    : '确定并编辑下一页'
})

const loading = ref(false)
const btnLoading = ref(false)
const formRef = ref<FormInstance>()
const form = ref<UpdateDeptInfoParams>({
  deptId: 0,
  parentId: 0,
  deptName: '',
  leader: '',
  phone: '',
  email: '',
  status: 0,
  sortNum: 0,
  remark: '',
})
const rules = reactive({
  parentId: [{ required: true, message: '请选择上级部门', trigger: 'blur' }],
  deptName: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
  leader: [{ required: true, message: '请输入负责人', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { min: 11, max: 11, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
  status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
  sortNum: [{ required: true, message: '请输入排序', trigger: 'blur' }],
})
const deptTreeList = ref<Partial<DeptTree>[]>([])

const getData = async () => {
  loading.value = true
  const deptTreeListRes = await getDeptSelectListApi().catch(e => e)
  if (deptTreeListRes.code === 200) {
    deptTreeList.value = deptTreeListRes.data
    deptTreeList.value.unshift({
      deptId: 0,
      deptName: '顶级菜单',
      children: [],
    })
  }
  const deptInfoRes = await getDeptInfoApi(
    idList.value[currentIndex.value],
  ).catch(e => e)
  if (deptInfoRes.code === 200) {
    form.value = deptInfoRes.data
  }
  loading.value = false
}

const resetForm = () => {
  currentIndex.value = 0
  idList.value = []
  form.value = {
    deptId: 0,
    parentId: 0,
    deptName: '',
    leader: '',
    phone: '',
    email: '',
    status: 0,
    sortNum: 0,
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
      const result = await updateDeptApi(form.value).catch(e => e)
      if (result.code === 200) {
        if (currentIndex.value === idList.value.length - 1) {
          yoiDialogRef.value.confirmClose()
        } else {
          elMsgSuccess('已提交')
          currentIndex.value++
          getData()
        }
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
const open = (ids: number[]) => {
  yoiDialogRef.value.open()
  resetForm()
  idList.value = ids
  getData()
}

defineExpose({
  open,
})
</script>

<style scoped></style>
