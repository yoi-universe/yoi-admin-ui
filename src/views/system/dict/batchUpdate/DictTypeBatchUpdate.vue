<template>
  <YoiDialog
    ref="yoiDialogRef"
    title="修改字典类型"
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
            <!-- 字典名称 -->
            <el-form-item label="字典名称" prop="dictName">
              <el-input
                v-model.trim="form.dictName"
                placeholder="请输入字典名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="{ span: 24 }" :sm="{ span: 12 }" class="pl-10px">
            <!-- 字典类型 -->
            <el-form-item label="字典类型" prop="dictType">
              <el-input
                v-model.trim="form.dictType"
                placeholder="请输入字典类型"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :xs="{ span: 24 }" :sm="{ span: 12 }">
            <!-- 字典状态 -->
            <el-form-item label="字典状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择字典状态">
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
            <!-- 字典备注 -->
            <el-form-item label="字典备注" prop="remark">
              <el-input
                v-model="form.remark"
                :rows="5"
                type="textarea"
                placeholder="请输入字典备注"
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
import type { UpdateDictTypeInfoParams } from '@/api/system/dict/type'
import {
  getDictTypeInfoApi,
  updateDictTypeApi,
} from '@/api/system/dict/dictType'
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
const form = ref<UpdateDictTypeInfoParams>({
  dictId: 0,
  dictName: '',
  dictType: '',
  status: 0,
  sortNum: 0,
  remark: '',
})
const rules = reactive({
  dictName: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
  dictType: [{ required: true, message: '请输入字典类型', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
  sortNum: [{ required: true, message: '请输入排序', trigger: 'blur' }],
})

const getData = async () => {
  loading.value = true
  const dictTypeInfoRes = await getDictTypeInfoApi(
    idList.value[currentIndex.value],
  ).catch(e => e)
  if (dictTypeInfoRes.code === 200) {
    form.value = dictTypeInfoRes.data
  }
  loading.value = false
}

const resetForm = () => {
  currentIndex.value = 0
  idList.value = []
  form.value = {
    dictId: 0,
    dictName: '',
    dictType: '',
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
      const result = await updateDictTypeApi(form.value).catch(e => e)
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
