<template>
  <div class="yoi-flex">
    <YoiCard>
      <!-- 搜索条件 -->
      <el-form :inline="true" v-show="showSearch">
        <el-form-item label="岗位名称" prop="postName">
          <el-input
            v-model="searchParams.postName"
            placeholder="请输入岗位名称"
            clearable
            style="width: 240px"
          />
        </el-form-item>

        <el-form-item label="岗位编码" prop="postCode">
          <el-input
            v-model="searchParams.postCode"
            placeholder="请输入岗位编码"
            clearable
            style="width: 240px"
          />
        </el-form-item>

        <el-form-item label="岗位状态" prop="status">
          <el-select
            placeholder="请选择岗位状态"
            v-model.number="searchParams.status"
            clearable
            style="width: 240px"
          >
            <el-option label="正常" :value="0" />
            <el-option label="停用" :value="1" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            icon="Search"
            plain
            v-throttle="handleSearch"
            >搜索</el-button
          >
          <el-button type="danger" icon="refresh" plain v-debounce="resetSearch"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <!-- 表格头部按钮 -->
      <el-row :gutter="10">
        <el-col :span="1.5">
          <el-button type="primary" icon="Plus" plain @click="handleAdd"
            >新增</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            icon="Edit"
            plain
            :disabled="multiple"
            @click="handleBatchUpdate"
            >修改</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            icon="Delete"
            plain
            :disabled="multiple"
            @click="handleBatchDelete"
            >删除</el-button
          >
        </el-col>
        <YoiToolbar v-model:show-search="showSearch" @refresh-table="getData" />
      </el-row>
      <br />
      <!-- 数据表格 -->
      <el-table
        v-loading="loading"
        :data="tableList"
        border
        empty-text="暂时没有数据"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" width="55" />
        <el-table-column
          prop="postName"
          label="岗位名称"
          align="center"
          width="160"
        />
        <el-table-column
          prop="postCode"
          label="岗位编号"
          align="center"
          width="160"
        />
        <el-table-column
          prop="status"
          label="岗位状态"
          align="center"
          width="100"
        >
          <template #default="{ row }">
            <YoiTag :tag-options="normalDisableOptions" :value="row.status" />
          </template>
        </el-table-column>
        <el-table-column
          prop="sortNum"
          label="排序"
          align="center"
          width="90"
        />
        <el-table-column
          prop="remark"
          label="岗位备注"
          align="center"
          width="220"
          show-overflow-tooltip
        />
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
          width="180"
        />
        <el-table-column
          prop="createBy"
          label="创建人"
          align="center"
          width="180"
        />
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-tooltip content="修改" placement="top">
              <el-button
                type="primary"
                icon="Edit"
                circle
                plain
                @click="handleUpdate(row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                type="danger"
                icon="Delete"
                circle
                plain
                @click="handleDelete(row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <br />
      <!-- 分页 -->
      <el-pagination
        background
        v-model:current-page="searchParams.pageNum"
        v-model:page-size="searchParams.pageSize"
        v-show="total > 0"
        :page-sizes="[10, 20, 50, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="getData"
        @current-change="getData"
      />
    </YoiCard>

    <PostAdd ref="addRef" @confirm="getData" />
    <PostUpdate ref="updateRef" @confirm="getData" />
    <PostBatchUpdate ref="batchUpdateRef" @confirm="getData" />
  </div>
</template>

<script lang="ts" setup name="rolePage">
import { onMounted, ref } from 'vue'
import YoiCard from '@/components/YoiCard/index.vue'
import YoiToolbar from '@/components/YoiToolbar/index.vue'
import PostAdd from './add/PostAdd.vue'
import PostUpdate from './update/PostUpdate.vue'
import PostBatchUpdate from './batchUpdate/PostBatchUpdate.vue'
import { elMsgError, elMsgSuccess, elMsgWarning } from '@/utils/elMsg'
import { elMsgBox } from '@/utils/elMsgBox'
import { useDictStore } from '@/stores'
import YoiTag from '@/components/YoiTag/index.vue'
import type { GetPostListParams } from '@/api/system/post/type'
import type { PostInfo } from '@/types/system/post'
import { deletePostApi, getPostListApi } from '@/api/system/post'

const searchParams = ref<GetPostListParams>({
  postName: '',
  postCode: '',
  status: null,
  pageNum: 1,
  pageSize: 10,
})
const total = ref(0)
const showSearch = ref(true)
// 数据表格加载页面动画
const loading = ref(false)
const ids = ref<number[]>([])
const multiple = ref(true)
const tableList = ref<PostInfo[]>([])
const handleSelectionChange = (val: PostInfo[]) => {
  ids.value = val.map(item => item.postId)
  multiple.value = !val.length
}

const dictStore = useDictStore()
const normalDisableOptions = ref([])
const getData = async () => {
  loading.value = true
  normalDisableOptions.value = await dictStore.getDictData('sys_normal_disable')
  const roleRes = await getPostListApi(searchParams.value)
  if (roleRes.code === 200) {
    tableList.value = roleRes.data.list
    total.value = roleRes.data.total
  } else {
    elMsgError(roleRes.message)
  }
  loading.value = false
}

const handleSearch = () => {
  searchParams.value.pageNum = 1
  getData()
}

const resetSearch = () => {
  searchParams.value = {
    postName: '',
    postCode: '',
    status: null,
    pageNum: 1,
    pageSize: 10,
  }
  getData()
}

const addRef = ref()
const handleAdd = () => {
  addRef.value.open()
}

const batchUpdateRef = ref()
const handleBatchUpdate = () => {
  batchUpdateRef.value.open(ids.value)
}

const handleBatchDelete = () => {
  if (ids.value.length === 0) {
    elMsgWarning('请选择要删除的数据')
    return
  }
  elMsgBox('您确认进行删除么？')
    .then(async () => {
      await deletePostApi(ids.value)
      elMsgSuccess('删除成功')
      getData()
    })
    .catch(e => {
      elMsgError(e.message || '已取消')
    })
}

const updateRef = ref()
const handleUpdate = (row: PostInfo) => {
  updateRef.value.open(row.postId)
}
const handleDelete = (row: PostInfo) => {
  const id = row.postId
  if (!id) {
    elMsgWarning('请选择要删除的数据')
    return
  }
  elMsgBox(`您确认需要删除菜单名称[${row.postName}]吗？`)
    .then(async () => {
      await deletePostApi([id])
      elMsgSuccess('删除成功')
      getData()
    })
    .catch(e => {
      elMsgError(e.message || '已取消')
    })
}

onMounted(() => {
  getData()
})
</script>

<style scoped></style>
