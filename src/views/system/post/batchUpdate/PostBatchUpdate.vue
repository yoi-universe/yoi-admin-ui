<template>
  <YoiDialog
    ref="yoiDialogRef"
    title="修改岗位"
    :loading="loading"
    :btn-loading="btnLoading"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    :confirm-text="submitText"
  >
    <template #content>
      <el-form ref="formRef" :rules="rules" :model="form" label-width="auto">
        <el-row>
          <el-col :xs="{ span: 24 }" :sm="{ span: 12 }">
            <!-- 岗位名称 -->
            <el-form-item label="岗位名称" prop="postName">
              <el-input
                v-model="form.postName"
                placeholder="请输入岗位名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="{ span: 24 }" :sm="{ span: 12 }" class="pl-10px">
            <!-- 岗位编码 -->
            <el-form-item label="岗位编码" prop="postCode">
              <el-input
                v-model="form.postCode"
                placeholder="请输入岗位编码"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :xs="{ span: 24 }" :sm="{ span: 12 }">
            <!-- 岗位状态 -->
            <el-form-item label="岗位状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择岗位状态">
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
            <!-- 岗位备注 -->
            <el-form-item label="岗位备注" prop="remark">
              <el-input
                v-model="form.remark"
                :rows="5"
                type="textarea"
                placeholder="请输入岗位备注"
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
import type { UpdatePostInfoParams } from '@/api/system/post/type'
import { getPostInfoApi, updatePostApi } from '@/api/system/post'
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
const form = ref<UpdatePostInfoParams>({
  postId: 0,
  postName: '',
  postCode: '',
  sortNum: 0,
  status: 0,
  remark: '',
})
const rules = reactive({
  postName: [{ required: true, message: '请输入岗位名称', trigger: 'blur' }],
  postCode: [{ required: true, message: '请输入岗位编码', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
  sortNum: [{ required: true, message: '请输入排序', trigger: 'blur' }],
})

const getData = async () => {
  loading.value = true
  const postInfoRes = await getPostInfoApi(
    idList.value[currentIndex.value],
  ).catch(e => e)
  if (postInfoRes.code === 200) {
    form.value = postInfoRes.data
  }
  loading.value = false
}

const resetForm = () => {
  currentIndex.value = 0
  idList.value = []
  form.value = {
    postId: 0,
    postName: '',
    postCode: '',
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
      const result = await updatePostApi(form.value).catch(e => e)
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
