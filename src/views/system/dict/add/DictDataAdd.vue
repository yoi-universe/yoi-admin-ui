<template>
  <YoiDialog
    ref="yoiDialogRef"
    title="添加字典数据"
    :btn-loading="btnLoading"
    @confirm="handleConfirm"
    @cancel="handleCancel"
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
import { reactive, ref } from 'vue'
import YoiDialog from '@/components/YoiDialog/index.vue'
import type { FormInstance } from 'element-plus'
import type { AddDictDataInfoParams } from '@/api/system/dict/type'
import { addDictDataApi } from '@/api/system/dict/dictData'
import { elMsgError } from '@/utils/elMsg'
import { useDictStore } from '@/stores'
import type { DictDataInfo } from '@/types/system/dict'

const btnLoading = ref(false)
const formRef = ref<FormInstance>()
const form = ref<AddDictDataInfoParams>({
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
  listClassOptions.value = await dictStore.getDictData('sys_tags_type')
}

const resetForm = () => {
  form.value = {
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
      const result = await addDictDataApi(form.value).catch(e => e)
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
const open = (dictType: string) => {
  yoiDialogRef.value.open()
  resetForm()
  form.value.dictType = dictType
  getData()
}

defineExpose({
  open,
})
</script>

<style scoped></style>
