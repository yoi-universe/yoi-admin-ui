<template>
  <YoiDialog
    ref="yoiDialogRef"
    title="修改字典数据"
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
            <!-- 字典标签 -->
            <el-form-item label="字典标签" prop="dictLabel">
              <el-input
                v-model="form.dictLabel"
                placeholder="请输入字典标签"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="{ span: 24 }" :sm="{ span: 12 }" class="pl-10px">
            <!-- 字典数据 -->
            <el-form-item label="字典数据" prop="dictValue">
              <el-input
                v-model="form.dictValue"
                placeholder="请输入字典数据"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :xs="{ span: 24 }" :sm="{ span: 12 }">
            <!--  -->
            <el-form-item label="回显样式" prop="listClass">
              <el-select v-model="form.listClass" placeholder="请选择回显样式">
                <el-option
                  v-for="item in listClassOptions"
                  :key="item.dictCode"
                  :label="`${item.dictLabel}(${item.dictValue})`"
                  :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="{ span: 24 }" :sm="{ span: 12 }" class="pl-10px">
            <el-form-item label="样式属性" prop="cssClass">
              <el-input
                v-model="form.cssClass"
                placeholder="例如：width: 100px;"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :xs="{ span: 24 }" :sm="{ span: 12 }">
            <!-- 字典状态 -->
            <el-form-item label="字典状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择字典状态">
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
import { elMsgError, elMsgSuccess } from '@/utils/elMsg'
import { useDictStore } from '@/stores'
import type { DictDataInfo } from '@/types/system/dict'
import type { UpdateDictDataInfoParams } from '@/api/system/dict/type'
import {
  getDictDataInfoApi,
  updateDictDataApi,
} from '@/api/system/dict/dictData'

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
const form = ref<UpdateDictDataInfoParams>({
  dictCode: 0,
  dictLabel: '',
  dictValue: '',
  dictType: '',
  cssClass: '',
  listClass: '',
  isDefault: 0,
  status: 0,
  sortNum: 0,
  remark: '',
})
const rules = reactive({
  dictLabel: [{ required: true, message: '请输入字典标签', trigger: 'blur' }],
  dictValue: [{ required: true, message: '请输入字典数据', trigger: 'blur' }],
  listClass: [{ required: true, message: '请选择回显样式', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
  sortNum: [{ required: true, message: '请输入排序', trigger: 'blur' }],
})

const listClassOptions = ref<DictDataInfo[]>([])

const dictStore = useDictStore()
const getData = async () => {
  loading.value = true
  listClassOptions.value = await dictStore.getDictData('sys_tags_type')
  const dictDataInfoRes = await getDictDataInfoApi(
    idList.value[currentIndex.value],
  ).catch(e => e)
  if (dictDataInfoRes.code === 200) {
    form.value = dictDataInfoRes.data
  }
  loading.value = false
}

const resetForm = () => {
  currentIndex.value = 0
  idList.value = []
  form.value = {
    dictCode: 0,
    dictLabel: '',
    dictValue: '',
    dictType: '',
    cssClass: '',
    listClass: '',
    isDefault: 0,
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
      if (!form.value.dictType) {
        elMsgError('字典类型为空无法提交')
        return
      }
      btnLoading.value = true
      console.log('submit!')
      const result = await updateDictDataApi(form.value).catch(e => e)
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
const open = (ids: number[], dictType: string) => {
  yoiDialogRef.value.open()
  resetForm()
  idList.value = ids
  form.value.dictType = dictType
  getData()
}

defineExpose({
  open,
})
</script>

<style scoped></style>
