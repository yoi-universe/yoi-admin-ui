<template>
  <div class="upload-box">
    <el-upload
      :id="uid"
      :action="action"
      :class="[
        'upload',
        imageDisabled ? 'disabled' : '',
        drag ? 'no-border' : '',
      ]"
      :multiple="false"
      :disabled="imageDisabled"
      :show-file-list="false"
      :http-request="handleHttpUpload"
      :before-upload="beforeUpload"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :drag="drag"
      :accept="fileType.join(',')"
    >
      <template v-if="imageUrl">
        <img :src="prefix + imageUrl" class="upload-image" />
        <div class="upload-operate" @click.stop>
          <div
            v-if="!imageDisabled"
            class="upload-icon"
            @click="handleEditImage"
          >
            <el-icon><Edit /></el-icon>
            <span>编辑</span>
          </div>
          <div class="upload-icon" @click="imageViewShow = true">
            <el-icon><ZoomIn /></el-icon>
            <span>查看</span>
          </div>
          <div
            v-if="!imageDisabled"
            class="upload-icon"
            @click="handleDeleteImage"
          >
            <el-icon><Delete /></el-icon>
            <span>删除</span>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="upload-content">
          <slot name="content">
            <!-- content 插槽 自定义提示内容 -->
            <el-icon><Plus /></el-icon>
            <!-- <span>请上传图片</span> -->
          </slot>
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
      :url-list="[prefix + imageUrl]"
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
  type UploadProps,
  type UploadRequestOptions,
} from 'element-plus'
import { computed, inject, ref, useId } from 'vue'

const uid = useId()
const prefix = import.meta.env.VITE_FILE_URL + '/get_img/'
const imageUrl = defineModel<string>('imageUrl')
const {
  action = '/common/upload_img',
  drag = true,
  disabled = false,
  fileSize = 3,
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
} = defineProps<Props>()

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
      imageUrl.value = res.data
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
 * @description 删除图片
 * */
const handleDeleteImage = () => {
  imageUrl.value = ''
}

/**
 * @description 编辑图片
 * */
const handleEditImage = () => {
  const dom = document.querySelector(`#${uid} .el-upload__input`)
  dom && dom.dispatchEvent(new MouseEvent('click'))
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
 * @description 图片上传成功
 * */
const uploadSuccess = () => {
  elMsgSuccess('图片上传成功！')
}

/**
 * @description 图片上传错误
 * */
const uploadError = () => {
  elMsgError('图片上传失败，请您重新上传！')
}
</script>
<script lang="ts">
interface Props {
  action?: string // 上传图片的 api 方法，一般项目上传都是同一个 api 方法，在组件里直接引入即可 ==> 非必传
  drag?: boolean // 是否支持拖拽上传 ==> 非必传[默认为 true]
  disabled?: boolean // 是否禁用上传组件 ==> 非必传[默认为 false]
  fileSize?: number // 图片大小限制 ==> 非必传[默认为 3M]
  fileType?: string[] // 图片类型限制 ==> 非必传[默认为 ["image/webp","image/jpg", "image/jpeg", "image/png", "image/gif"]]
  height?: string // 组件高度 ==> 非必传[默认为 120px]
  width?: string // 组件宽度 ==> 非必传[默认为 120px]
  borderRadius?: string // 组件边框圆角 ==> 非必传[默认为 6px]
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
  .el-upload,
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
      border: 2px dashed var(--el-color-primary);
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
  }

  // 提示文字样式
  .upload-tip {
    font-size: 12px;
    line-height: 26px;
    color: var(--el-color-primary);
    text-align: left;
  }
}
</style>
