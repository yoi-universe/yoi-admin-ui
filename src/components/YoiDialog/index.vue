<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="width"
    :center="center"
    :close-on-click-modal="closeOnClickModal"
    :append-to-body="appendToBody"
    :draggable="draggable"
    :destroy-on-close="destroyOnClose"
    :fullscreen="fullscreen"
    :before-close="close"
  >
    <slot name="header"></slot>
    <el-scrollbar class="container" :height="height + 'px'">
      <slot name="content"></slot>
    </el-scrollbar>
    <template #footer v-if="!footerHidden">
      <div class="dialog-footer">
        <el-button type="primary" :loading="loading" v-throttle="handleConfirm">
          {{ confirmText }}
        </el-button>
        <el-button type="danger" @click="handleCancel">{{
          cancelText
        }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { elMsgSuccess, elMsgWarning } from '@/utils/elMsg'
import { ElMessageBox } from 'element-plus'
import { ref } from 'vue'

const visible = ref(false)
const {
  title = '弹窗',
  width = 650,
  height = 300,
  center = false,
  closeOnClickModal = false,
  appendToBody = true,
  draggable = true,
  destroyOnClose = false,
  fullscreen = false,
  loading = false,
  confirmText = '确定',
  cancelText = '取消',
  footerHidden = false,
} = defineProps<Props>()

// 关闭弹窗
const close = () => {
  ElMessageBox.confirm('您确认进行关闭么？', '温馨提示：', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
    dangerouslyUseHTMLString: true,
  })
    .then(() => {
      visible.value = false
      elMsgWarning('已关闭')
    })
    .catch(() => {
      elMsgWarning('已取消')
    })
}

const emit = defineEmits(['confirm', 'cancel'])
const handleConfirm = () => {
  emit('confirm')
}
const handleCancel = () => {
  emit('cancel')
}

// 打开弹窗
const open = () => {
  visible.value = true
}

// 提交后关闭
const confirmClose = () => {
  visible.value = false
  elMsgSuccess('已提交')
}

defineExpose({
  open,
  close,
  confirmClose,
})
</script>
<script lang="ts">
interface Props {
  title?: string // 弹窗标题
  width?: string | number // 弹窗宽度
  height?: string | number // 弹窗高度
  center?: boolean // 是否居中
  closeOnClickModal?: boolean // 是否点击遮罩关闭
  appendToBody?: boolean // 是否将弹窗插入body
  draggable?: boolean // 是否可拖拽
  destroyOnClose?: boolean // 关闭时销毁 dom
  fullscreen?: boolean // 是否全屏
  loading?: boolean // 是否显示loading
  confirmText?: string // 确认按钮文字
  cancelText?: string // 取消按钮文字
  footerHidden?: boolean // 隐藏底部
}
</script>

<style lang="scss" scoped>
.container {
  padding-right: 10px;
}
</style>
