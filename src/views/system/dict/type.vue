<template>
  <div class="yoi-flex">
    <YoiCard>
      <!-- 搜索条件 -->
      <el-form :inline="true" v-show="showSearch">
        <el-form-item label="字典名称" prop="dictName">
          <el-input
            v-model="searchParams.dictName"
            placeholder="请输入字典名称"
            clearable
            style="width: 240px"
          />
        </el-form-item>

        <el-form-item label="字典类型" prop="dictType">
          <el-input
            v-model="searchParams.dictType"
            placeholder="请输入字典类型"
            clearable
            style="width: 240px"
          />
        </el-form-item>

        <el-form-item label="字典状态" prop="status">
          <el-select
            placeholder="请选择字典状态"
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
        <el-col :span="1.5">
          <el-button
            type="danger"
            icon="Refresh"
            plain
            @click="handleRefreshCache"
            >刷新缓存</el-button
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
        row-key="menuId"
        :tree-props="{ children: 'children' }"
        empty-text="暂时没有数据"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" width="55" />
        <el-table-column
          prop="dictName"
          label="字典名称"
          align="center"
          width="160"
        />
        <el-table-column
          prop="dictType"
          label="字典类型"
          align="center"
          width="160"
        >
          <template #default="{ row }">
            <el-link
              type="primary"
              :underline="false"
              @click="handleView(row)"
              >{{ row.dictType }}</el-link
            >
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="100">
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
          label="备注"
          align="center"
          width="200"
          show-overflow-tooltip
        />
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
          width="180"
        />
        <el-table-column
          prop="updateTime"
          label="修改时间"
          align="center"
          width="180"
        />
        <el-table-column
          prop="updateBy"
          label="修改人"
          align="center"
          width="160"
        />
        <el-table-column label="操作" align="center" width="180" fixed="right">
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

    <DictTypeAdd ref="addRef" @confirm="getData" />
    <DictTypeUpdate ref="updateRef" @confirm="getData" />
    <DictTypeBatchUpdate ref="batchUpdateRef" @confirm="getData" />
  </div>
</template>

<script lang="ts" setup name="dictTypePage">
import { onMounted, ref } from 'vue'
import YoiCard from '@/components/YoiCard/index.vue'
import YoiToolbar from '@/components/YoiToolbar/index.vue'
import DictTypeAdd from './add/DictTypeAdd.vue'
import DictTypeUpdate from './update/DictTypeUpdate.vue'
import DictTypeBatchUpdate from './batchUpdate/DictTypeBatchUpdate.vue'
import { elMsgError, elMsgSuccess, elMsgWarning } from '@/utils/elMsg'
import { elMsgBox } from '@/utils/elMsgBox'
import type { GetDictTypeListParams } from '@/api/system/dict/type'
import type { DictTypeInfo } from '@/types/system/dict'
import {
  deleteDictTypeApi,
  getDictTypeListApi,
  refreshDictCacheApi,
} from '@/api/system/dict/dictType'
import { useRouter } from 'vue-router'
import { useDictStore } from '@/stores'
import YoiTag from '@/components/YoiTag/index.vue'

const searchParams = ref<GetDictTypeListParams>({
  dictName: '',
  dictType: '',
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
const tableList = ref<DictTypeInfo[]>([])
const handleSelectionChange = (val: DictTypeInfo[]) => {
  ids.value = val.map(item => item.dictId)
  multiple.value = !val.length
}

const dictStore = useDictStore()
const normalDisableOptions = ref([])
const getData = async () => {
  loading.value = true
  normalDisableOptions.value = await dictStore.getDictData('sys_normal_disable')
  const dictTypeRes = await getDictTypeListApi(searchParams.value)
  if (dictTypeRes.code === 200) {
    tableList.value = dictTypeRes.data.list
    total.value = dictTypeRes.data.total
  } else {
    elMsgError(dictTypeRes.message)
  }
  loading.value = false
}

const handleSearch = () => {
  searchParams.value.pageNum = 1
  getData()
}

const resetSearch = () => {
  searchParams.value = {
    dictName: '',
    dictType: '',
    status: null,
    pageNum: 1,
    pageSize: 10,
  }
  getData()
}

const router = useRouter()
const handleView = (row: DictTypeInfo) => {
  router.push(`/dict_data/${row.dictType}`)
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
      await deleteDictTypeApi(ids.value)
      elMsgSuccess('删除成功')
      getData()
    })
    .catch(e => {
      elMsgError(e.message || '已取消')
    })
}

const handleRefreshCache = async () => {
  const res = await refreshDictCacheApi().catch(e => e)
  if (res.code === 200) {
    elMsgSuccess('刷新成功')
  }
}

const updateRef = ref()
const handleUpdate = (row: DictTypeInfo) => {
  updateRef.value.open(row.dictId)
}
const handleDelete = (row: DictTypeInfo) => {
  const id = row.dictId
  if (!id) {
    elMsgWarning('请选择要删除的数据')
    return
  }
  elMsgBox(`您确认需要删除菜单名称[${row.dictName}]吗？`)
    .then(async () => {
      await deleteDictTypeApi([id])
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
