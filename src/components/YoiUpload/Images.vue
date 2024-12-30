<template>
  <div class="upload-box">
    <el-upload
      v-model:file-list="files"
      :limit="limit"
      :id="uid"
      :action="action"
      list-type="picture-card"
      :class="[
        'upload',
        imageDisabled ? 'disabled' : '',
        drag ? 'no-border' : '',
        files.length >= limit ? 'hide' : '',
      ]"
      :multiple="true"
      :disabled="imageDisabled"
      :http-request="handleHttpUpload"
      :before-upload="beforeUpload"
      :on-exceed="handleExceed"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :drag="drag"
      :accept="fileType.join(',')"
    >
      <div class="upload-content">
        <slot name="content">
          <!-- content 插槽 自定义提示内容 -->
          <el-icon><Plus /></el-icon>
          <!-- <span>请上传图片</span> -->
        </slot>
      </div>
      <template #file="{ file }">
        <img :src="prefix + file.name" class="upload-image" />
        <div class="upload-operate" @click.stop>
          <div class="upload-icon" @click="handlePictureCardPreview(file)">
            <el-icon><ZoomIn /></el-icon>
            <span>查看</span>
          </div>
          <div
            v-if="!imageDisabled"
            class="upload-icon"
            @click="handleRemove(file)"
          >
            <el-icon><Delete /></el-icon>
            <span>删除</span>
          </div>
        </div>
      </template>
    </el-upload>
    <!-- 图片提示 -->
    <div class="upload-tip">
      <slot name="tip"></slot>
    </div>
    <!-- 图片预览 -->
    <el-image-viewer
      v-if="imageViewShow"
      :url-list="[prefix + viewImageUrl]"
      @close="imageViewShow = false"
    />
  </div>
</template>

<script lang="ts" setup>
import { uploadImgApi } from '@/api/common'
import { elMsgError, elMsgSuccess, elMsgWarning } from '@/utils/elMsg'
import {
  ElLoading,
  formContextKey,
  formItemContextKey,
  type UploadFile,
  type UploadProps,
  type UploadRequestOptions,
  type UploadUserFile,
} from 'element-plus'
import { computed, inject, ref, useId, watch } from 'vue'

const uid = useId()
const prefix = import.meta.env.VITE_IMAGE_URL + '/'
const {
  action = '/common/upload_img',
  drag = true,
  disabled = false,
  fileSize = 3,
  limit = 5,
  fileType = [
    'image/webp',
    'image/jpg',
    'image/jpeg',
    'image/png',
    'image/gif',
  ],
  height = '120px',
  width = '120px',
  borderRadius = '6px',
  fileList = '',
} = defineProps<Props>()

/**
 * @description 图片上传成功
 * @param response 上传响应结果
 * @param uploadFile 上传的文件
 * */
const emit = defineEmits(['update:fileList'])

// 查看图片
const imageViewShow = ref(false)
// 获取 el-form 组件上下文
const formContext = inject(formContextKey, void 0)
// 获取 el-form-item 组件上下文
const formItemContext = inject(formItemContextKey, void 0)
// 判断是否禁用上传和删除
const imageDisabled = computed(() => {
  return disabled || formContext?.disabled
})

const viewImageUrl = ref('')
let files = ref<UploadUserFile[]>([])
// 修改进行回显的时候使用
watch(
  () => [fileList],
  () => {
    // 父组件传递回显数据
    const arr = fileList.split(',')
    files.value = arr.map(item => {
      return {
        name: item,
      }
    })
  },
  { immediate: true },
)

/**
 * @description 图片上传
 * @param options upload 所有配置项
 * */
const handleHttpUpload = async (options: UploadRequestOptions) => {
  let formData = new FormData()
  formData.append('file', options.file)
  const loadingInstance = ElLoading.service({
    text: '正在上传',
    background: 'rgba(0,0,0,.2)',
  })
  try {
    const res = await uploadImgApi(formData)
    if (res.code === 200) {
      options.onSuccess(res.data)
    }
    loadingInstance.close()
    // 调用 el-form 内部的校验方法[可自动校验]
    formItemContext?.prop &&
      formContext?.validateField([formItemContext.prop as string])
  } catch (error) {
    loadingInstance.close()
    options.onError(error as any)
  }
}

/**
 * @description 图片上传成功
 * */
const uploadSuccess = (
  response: string | undefined,
  uploadFile: UploadFile,
) => {
  if (!response) return
  uploadFile.name = response!
  formatData()
  elMsgSuccess('图片上传成功！')
}

/**
 * @description 删除图片
 * */
const handleRemove = (file: UploadFile) => {
  files.value = files.value.filter(item => item.name !== file.name)
  formatData()
}

/**
 * @description 超出最大图片上传数
 */
const handleExceed = () => {
  elMsgWarning(`当前最多只能上传 ${limit} 张图片，请移除后上传！`)
}

/**
 * @description 图片预览
 * @param file 图片文件
 */
const handlePictureCardPreview = (file: UploadFile) => {
  viewImageUrl.value = file.name!
  imageViewShow.value = true
}

/**
 * @description 文件上传之前判断
 * @param rawFile 选择的文件
 * */
const beforeUpload: UploadProps['beforeUpload'] = rawFile => {
  const imgSize = rawFile.size / 1024 / 1024 < fileSize
  const imgType = fileType.includes(rawFile.type)
  if (!imgType) elMsgWarning('上传图片不符合所需的格式！')
  if (!imgSize) elMsgWarning(`上传图片大小不能超过 ${fileSize}M！`)
  return imgType && imgSize
}

/**
 * @description 图片上传错误
 * */
const uploadError = () => {
  elMsgError('图片上传失败，请您重新上传！')
}

const formatData = () => {
  let fileList = files.value.map(item => item.name).join(',')
  emit('update:fileList', fileList)
}
</script>
<script lang="ts">
interface Props {
  action?: string // 上传图片的 api 方法，一般项目上传都是同一个 api 方法，在组件里直接引入即可 ==> 非必传
  drag?: boolean // 是否支持拖拽上传 ==> 非必传[默认为 true]
  disabled?: boolean // 是否禁用上传组件 ==> 非必传[默认为 false]
  limit?: number // 最大图片上传数 ==> 非必传[默认为 5张]
  fileSize?: number // 图片大小限制 ==> 非必传[默认为 3M]
  fileType?: string[] // 图片类型限制 ==> 非必传[默认为 ["image/webp","image/jpg", "image/jpeg", "image/png", "image/gif"]]
  height?: string // 组件高度 ==> 非必传[默认为 120px]
  width?: string // 组件宽度 ==> 非必传[默认为 120px]
  borderRadius?: string // 组件边框圆角 ==> 非必传[默认为 6px]
  fileList?: string // 文件名以逗号分割 ==> 非必传
}
</script>

<style lang="scss" scoped>
// 错误样式
.is-error {
  .upload {
    :deep(.el-upload),
    :deep(.el-upload-dragger) {
      border-color: var(--el-color-danger) !important;
      &:hover {
        border-color: var(--el-color-primary) !important;
      }
    }
  }
}

// 禁止上传样式
:deep(.disabled) {
  .el-upload--picture-card,
  .el-upload-dragger {
    cursor: not-allowed !important;
    background: var(--el-color-primary-light-9);
    border-color: var(--el-color-primary) !important;
    &:hover {
      border-color: var(--el-color-primary) !important;
    }
  }
}

.upload-box {
  // 可拖拽时取消边框
  .no-border {
    :deep(.el-upload) {
      border: none !important;
    }
  }
  :deep(.upload) {
    .el-upload {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: v-bind(width);
      height: v-bind(height);
      overflow: hidden;
      border: 1px dashed var(--el-color-primary);
      border-radius: v-bind(borderRadius);
      transition: var(--el-transition-duration-fast);
      &:hover {
        background: var(--el-color-primary-light-9);
        .upload-operate {
          opacity: 1;
        }
      }
      .el-upload-dragger {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: 0;
        overflow: hidden;
        background-color: transparent;
        border-color: var(--el-color-primary);
        border-radius: v-bind(borderRadius);
        &:hover {
          border-color: var(--el-color-primary);
        }
      }
      .el-upload-dragger.is-dragover {
        background-color: var(--el-color-primary-light-9);
        border-color: var(--el-color-primary) !important;
      }
    }

    .el-upload-list__item,
    .el-upload--picture-card {
      width: v-bind(width);
      height: v-bind(height);
      background-color: transparent;
      border: 1px dashed var(--el-color-primary);
      border-radius: v-bind(borderRadius);
      &:hover {
        background-color: var(--el-color-primary-light-9);
        .upload-operate {
          opacity: 1;
        }
      }
    }

    // 框内展示的img样式
    .upload-image {
      width: 100%;
      height: 100%;
      object-fit: contain; // 图片缩放模式
    }

    // 提示文字样式
    .upload-content {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      line-height: 30px;
      color: var(--el-color-primary);
      .el-icon {
        font-size: 28px;
        color: var(--el-color-primary);
      }
    }

    // 操作按钮样式
    .upload-operate {
      position: absolute;
      top: 0;
      right: 0;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      cursor: pointer;
      background: rgb(0 0 0 / 50%);
      opacity: 0;
      transition: var(--el-transition-duration-fast);
      color: var(--el-color-primary);

      // 操作按钮内部样式
      .upload-icon {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0 6%;
        color: var(--el-color-primary-light-2);
        .el-icon {
          margin-bottom: 40%;
          font-size: 130%;
          line-height: 130%;
        }
        span {
          font-size: 85%;
          line-height: 85%;
        }
      }
    }
  }

  // 提示文字样式
  .upload-tip {
    font-size: 12px;
    line-height: 26px;
    color: var(--el-color-primary);
    text-align: left;
  }

  // 上传数量到达上限，隐藏上传按钮
  :deep(.hide) .el-upload--picture-card {
    display: none;
  }
}
</style>
