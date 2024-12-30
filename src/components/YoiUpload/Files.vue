<template>
  <div>
    <!-- 注意：只能通过 on-change 钩子函数来对上传文件的列表进行控制。 -->
    <el-upload
      :file-list="files"
      :multiple="isMultiple"
      :limit="limit"
      :action="action"
      :accept="acceptType"
      :auto-upload="false"
      :show-file-list="false"
      :disabled="filesDisabled"
      :on-exceed="handleExceed"
      :on-change="handleChange"
    >
      <div class="el-upload-text hover:bg-[--el-color-primary-light-9]">
        <el-icon size="16">
          <Upload />
        </el-icon>
        <span>上传文件</span>
      </div>
    </el-upload>
    <div style="margin-top: 6px">
      <div
        class="template-file text-#555 m-t-2px rounded-6px dark:text-#CFD3DC hover:bg-[--el-color-primary-light-9]"
        v-for="item in files"
        :key="item.newName"
      >
        <el-icon size="16" style="margin-right: 5px">
          <Link />
        </el-icon>
        <el-tooltip :content="item.fileName" placement="top">
          <div class="document-name hover:text-[--el-color-primary]">
            {{ item.fileName }}
          </div>
        </el-tooltip>
        <el-icon
          class="hover:text-[--el-color-primary]"
          v-if="!disabled"
          size="16"
          @click="handleRemove(item.newName)"
        >
          <Close />
        </el-icon>
        <!-- 默认不显示下载 -->
        <el-icon
          v-if="isDownload"
          class="p-l-5px hover:text-[--el-color-primary]"
          size="16"
          @click="handleDownLoad(item.newName, item.fileName)"
        >
          <Download />
        </el-icon>
      </div>
    </div>
    <span class="file-tips">
      <slot name="tip">
        支持{{ acceptTypes }}；
        <br />
        文件大小不能超过{{ fileSize }}M；最多上传{{ limit }}个；
      </slot>
    </span>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, ref, watch } from 'vue'
import {
  ElLoading,
  formContextKey,
  formItemContextKey,
  type UploadFile,
} from 'element-plus'
import { elMsgError, elMsgWarning } from '@/utils/elMsg'
import { uploadFileApi } from '@/api/common'
import type { FileInfo } from '@/types/fileInfo'

const emits = defineEmits(['fileSuccess', 'fileRemove', 'update:fileList'])
const prefix = import.meta.env.VITE_FILE_URL + '/'
// 接收父组件传递过来的参数
const {
  acceptType = '.png,.jpg,.jpeg,.webp,.gif,.mp3,.mp4,.xls,.xlsx,.pdf,.log,.doc,.docx,.txt,.jar,.zip',
  acceptTypes = '图片[png/jpg/webp/gif]、文件[txt/xls/xlsx]',
  isMultiple = true,
  limit = 5,
  disabled = false,
  fileSize = 10,
  action = '/common/upload_file',
  fileList = [],
  isDownload = true,
} = defineProps<Props>()

// 获取 el-form 组件上下文
const formContext = inject(formContextKey, void 0)
// 获取 el-form-item 组件上下文
const formItemContext = inject(formItemContextKey, void 0)
// 判断是否禁用上传和删除
const filesDisabled = computed(() => {
  return disabled || formContext?.disabled
})

let files = ref<FileInfo[]>([])
// 父组件传递回显数据
files.value = fileList
// 修改进行回显的时候使用
watch(
  () => [fileList],
  () => {
    // 父组件传递回显数据
    files.value = fileList
  },
)

const handleExceed = () => {
  elMsgWarning(`当前最多只能上传 ${limit} 个，请移除后上传！`)
}
/**
 * 文件变化 handleChange 这里监听上传文件的变化上传一个，执行一下后端上传单个文件请求方法。
 */
const handleChange = async (file: UploadFile) => {
  // 防止多次执行change
  const rawFile = file.raw
  const list = acceptTypes.split('/')
  let acceptTypeList = list.map((item: string) => {
    return getType(item)
  })
  // 如果要检索的字符串值没有出现，则该方法返回 -1
  const isString = acceptTypeList.filter((item: string) => {
    return rawFile!.type.indexOf(item) > -1
  })
  // 用于校验是否符合上传条件
  const type = acceptTypes.replace('/', ', ')
  if (isString.length < 1) {
    elMsgWarning(`仅支持格式为${type}的文件`)
    return false
  } else if (rawFile!.size / 1024 / 1024 > fileSize) {
    elMsgWarning(`文件大小不能超过${fileSize}MB!`)
    const arr = [...files.value]
    files.value = arr.filter((item: any) => {
      return item.uid != rawFile!.uid
    })
    return false
  } else {
    let formData = new FormData()
    formData.append('file', rawFile!)
    const loadingInstance = ElLoading.service({
      text: '正在上传',
      background: 'rgba(0,0,0,.2)',
    })
    try {
      const res = await uploadFileApi(formData)
      if (res.code === 200) {
        files.value.push(res.data)
        emits('update:fileList', files.value)
        emits('fileSuccess', res.data)
      }
      loadingInstance.close()
      // 调用 el-form 内部的校验方法[可自动校验]
      formItemContext?.prop &&
        formContext?.validateField([formItemContext.prop as string])
    } catch (error) {
      emits('update:fileList', files.value)
      loadingInstance.close()
      return false
    }
  }
  return true
}

// 文件类型映射表
const fileTypeMap: any = {
  xls: 'excel',
  xlsx: 'sheet',
  doc: 'word',
  docx: 'document',
  pdf: 'pdf',
  zip: 'zip',
  pptx: 'presentation',
  text: 'text',
  log: 'text',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  ogg: 'audio/ogg',
  mp4: 'video/mp4',
  avi: 'video/x-msvideo',
  mov: 'video/quicktime',
  webm: 'video/webm',
  json: 'application/json',
  xml: 'application/xml',
  yaml: 'application/yaml',
  js: 'application/javascript',
  css: 'text/css',
  html: 'text/html',
  txt: 'text/plain',
  csv: 'text/csv',
  md: 'text/markdown',
  sql: 'application/sql',
  sh: 'application/x-sh',
  py: 'text/x-python',
  rb: 'text/x-ruby',
  java: 'text/x-java',
  c: 'text/x-csrc',
  h: 'text/x-chdr',
  cpp: 'text/x-c++src',
  hpp: 'text/x-c++hdr',
  ts: 'application/typescript',
  sass: 'text/x-sass',
  scss: 'text/x-scss',
  less: 'text/x-less',
}

// 校验上传文件格式
const getType = (acceptType: string) => {
  const lowerCaseExt = acceptType.toLowerCase()
  return fileTypeMap[lowerCaseExt] || ''
}

// 移除文件
const handleRemove = (val: string) => {
  files.value = files.value.filter((item: any) => item.newName !== val)
  emits('update:fileList', files.value)
  emits('fileRemove', val)
}

// 下载文件
const handleDownLoad = async (newName: string, fileName: string) => {
  if (!newName && !fileName) {
    elMsgError('文件获取失败，请刷新重试')
  }
  try {
    const response = await fetch(prefix + newName)
    if (!response.ok) {
      elMsgError('网络异常，请刷新重试')
      return
    }
    // 创建 Blob 对象
    const blob = await response.blob()
    // 创建对象 URL
    const downloadUrl = window.URL.createObjectURL(blob)
    // 创建一个隐藏的下载链接
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = fileName // 设置下载文件名
    link.style.display = 'none'
    // 添加到 DOM 中
    document.body.appendChild(link)
    // 触发点击事件
    link.click()
    // 清理
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  } catch (error) {
    console.error('下载失败：', error)
    elMsgError('下载失败，请刷新重试')
  }
}
</script>
<script lang="ts">
interface Props {
  action?: string // 上传文件的 api 方法
  acceptType?: string // 上传文件类型
  acceptTypes?: string // 描述 - 上传文件类型
  isMultiple?: boolean //   是否可批量上传
  limit?: number // 允许上传文件的最大数量
  disabled?: boolean // 是否禁用上传
  fileSize?: number // 文件大小
  fileList?: FileInfo[] // 文件大小
  isDownload?: boolean // 是否可以下载
}
</script>

<style lang="scss" scoped>
.el-upload-text {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 106px;
  height: 32px;
  color: var(--el-color-primary);

  /* 设置用户禁止选中 */
  user-select: none;
  border: 1px dashed var(--el-color-primary);
  border-radius: 6px;

  span {
    padding-left: 6px;
    font-size: 14px;
    font-weight: 500;
  }
}

.template-file {
  display: flex;
  align-items: center;
  height: 18px;
  border-radius: 4px;
  padding: 3px 6px;
  max-width: 360px;

  .document-name {
    margin-right: 12px;
    font-size: 14px;
    line-height: 16px;
    height: 16px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    line-clamp: 1;
  }
}

.file-tips {
  font-size: 12px;
  color: var(--el-color-primary);
}
</style>
