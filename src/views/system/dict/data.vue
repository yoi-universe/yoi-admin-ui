<template>
  <div class="yoi-flex">
    <YoiCard>
      <!-- 搜索条件 -->
      <el-form :inline="true" v-show="showSearch">
        <el-form-item label="字典类型" prop="dictType">
          <el-select v-model="searchParams.dictType" style="width: 240px">
            <el-option
              v-for="item in dictOptions"
              :key="item.dictType"
              :label="item.dictName"
              :value="item.dictType"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="字典标签" prop="dictName">
          <el-input
            v-model="searchParams.dictLabel"
            placeholder="请输入字典标签"
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
            <el-option label="启用" :value="0" />
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
        row-key="menuId"
        :tree-props="{ children: 'children' }"
        empty-text="暂时没有数据"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" width="55" />
        <el-table-column
          prop="dictCode"
          label="字典编码"
          align="center"
          width="160"
        />
        <el-table-column
          prop="dictLabel"
          label="字典标签"
          align="center"
          width="160"
        >
          <template #default="{ row }">
            <el-tag
              :disable-transitions="true"
              :key="row.dictCode"
              :type="row.listClass"
              :style="row.cssClass"
            >
              {{ row.dictLabel }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="dictValue"
          label="字典键值"
          align="center"
          width="160"
        />
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

    <DictDataAdd ref="addRef" @confirm="getData" />
    <DictDataUpdate ref="updateRef" @confirm="getData" />
    <DictDataBatchUpdate ref="batchUpdateRef" @confirm="getData" />
  </div>
</template>

<script lang="ts" setup name="dictDataPage">
import { onMounted, ref } from 'vue'
import YoiCard from '@/components/YoiCard/index.vue'
import YoiToolbar from '@/components/YoiToolbar/index.vue'
import DictDataAdd from './add/DictDataAdd.vue'
import DictDataUpdate from './update/DictDataUpdate.vue'
import DictDataBatchUpdate from './batchUpdate/DictDataBatchUpdate.vue'
import { elMsgError, elMsgSuccess, elMsgWarning } from '@/utils/elMsg'
import { elMsgBox } from '@/utils/elMsgBox'
import type { GetDictDataListParams } from '@/api/system/dict/type'
import type { DictDataInfo, DictTypeInfo } from '@/types/system/dict'
import {
  deleteDictDataApi,
  getDictDataListApi,
} from '@/api/system/dict/dictData'
import { useRoute } from 'vue-router'
import { getDictTypeAllApi } from '@/api/system/dict/dictType'
import { useDictStore } from '@/stores'
import YoiTag from '@/components/YoiTag/index.vue'

const searchParams = ref<GetDictDataListParams>({
  dictType: '',
  dictLabel: '',
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
const tableList = ref<DictDataInfo[]>([])
const dictOptions = ref<DictTypeInfo[]>([])

const handleSelectionChange = (val: DictDataInfo[]) => {
  ids.value = val.map(item => item.dictCode)
  multiple.value = !val.length
}

const dictStore = useDictStore()
const normalDisableOptions = ref([])
const getData = async () => {
  loading.value = true
  normalDisableOptions.value = await dictStore.getDictData('sys_normal_disable')
  const dictTypeRes = await getDictTypeAllApi()
  if (dictTypeRes.code === 200) {
    dictOptions.value = dictTypeRes.data
  } else {
    elMsgError(dictTypeRes.message)
  }
  const dictDataRes = await getDictDataListApi(searchParams.value)
  if (dictDataRes.code === 200) {
    tableList.value = dictDataRes.data.list
    total.value = dictDataRes.data.total
  } else {
    elMsgError(dictDataRes.message)
  }
  loading.value = false
}

const handleSearch = () => {
  searchParams.value.pageNum = 1
  getData()
}

const resetSearch = () => {
  searchParams.value = {
    dictType: routeParam.value,
    dictLabel: '',
    status: null,
    pageNum: 1,
    pageSize: 10,
  }
  getData()
}

const addRef = ref()
const handleAdd = () => {
  addRef.value.open(routeParam.value)
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
      await deleteDictDataApi(ids.value)
      elMsgSuccess('删除成功')
      getData()
    })
    .catch(e => {
      elMsgError(e.message || '已取消')
    })
}

const updateRef = ref()
const handleUpdate = (row: DictDataInfo) => {
  updateRef.value.open(row.dictCode, routeParam.value)
}
const handleDelete = (row: DictDataInfo) => {
  const id = row.dictCode
  if (!id) {
    elMsgWarning('请选择要删除的数据')
    return
  }
  elMsgBox(`您确认需要删除菜单名称[${row.dictLabel}]吗？`)
    .then(async () => {
      await deleteDictDataApi([id])
      elMsgSuccess('删除成功')
      getData()
    })
    .catch(e => {
      elMsgError(e.message || '已取消')
    })
}

const route = useRoute()
const routeParam = ref()

onMounted(() => {
  routeParam.value = route.params.dictType || ''
  searchParams.value.dictType = routeParam.value
  getData()
})
</script>

<style scoped></style>
