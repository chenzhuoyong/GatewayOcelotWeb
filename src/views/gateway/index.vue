<template>
  <div class="flex flex-col items-center p-4">
    <div class="w-full text-right p-2">
      <el-button-group>
        <el-button type="primary" icon="CirclePlus" @click="handleAdd">新增</el-button>
        <el-button type="warning" icon="Remove" @click="handleDelete">删除</el-button>
        <el-button type="primary" icon="Search" @click="handleSearch">查询</el-button>
      </el-button-group>
    </div>
    <div class="w-full p-2">
      <el-form :inline="true" :label-width="140" :model="queryParams">
        <el-form-item label="项目名称" class="w-100">
          <el-input v-model="queryParams.projectName" placeholder="请输入项目名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="项目编码" class="w-100">
          <el-input v-model="queryParams.projectCode" placeholder="请输入项目编码" clearable></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="w-full">
      <el-table
        :border="true"
        :highlight-current-row="true"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="ProjectName" label="项目名称"></el-table-column>
        <el-table-column prop="ProjectCode" label="项目编码"></el-table-column>
        <el-table-column label="操作" :width="400">
          <template #default="scope">
            <el-button type="primary" @click="handleEditRow(scope.row)"> 编辑 </el-button>
            <el-button type="danger" @click="handleDeleteRow(scope.row)"> 删除 </el-button>
            <el-button type="warning" @click="handlePublish(scope.row)"> 发布 </el-button>
            <el-button type="success" @click="handleViewHistory(scope.row)"> 发布历史 </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:currentPage="queryParams.pageIndex"
        v-model:page-size="queryParams.pageSize"
        :total="total"
        @current-change="handlePageChange"
        layout="prev, pager, next"
      ></el-pagination>
    </div>

    <el-drawer v-model="showDetailForm" size="100%" :with-header="false">
      <Detail ref="detailRef" :id="editGateway?.Id || ''" @on-close="handleClose" />
    </el-drawer>
    <el-drawer v-model="showHistoryForm" size="70%">
      <PublishList ref="publishListRef" />
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import http from "@/utils/request";
import { api, showConfirm } from "./helper";
import Detail from "./components/Detail.vue";
import PublishList from "./components/PublishList.vue";
import { ElMessage } from "element-plus";
import { GatewayConfigDto, GatewayConfigFindInput } from "./type";

const showDetailForm = ref(false);
const showHistoryForm = ref(false);
const detailRef = useTemplateRef("detailRef");
const publishListRef = useTemplateRef("publishListRef");

const queryParams = reactive<GatewayConfigFindInput>({
  projectName: "",
  projectCode: "",
  pageSize: 10,
  pageIndex: 1,
});

const tableData = ref<GatewayConfigDto[]>([]);
const selectedGateways = ref<GatewayConfigDto[]>([]);
const editGateway = ref<GatewayConfigDto>();
const total = ref(0);

const fetchData = async () => {
  var res = await http.post(api.list, queryParams);
  tableData.value = res.data.Items;
  total.value = res.data.Total;
};

const handleAdd = () => {
  detailRef.value?.refreshGateway("");
  showDetailForm.value = true;
};

const handleDelete = async () => {
  showConfirm("你确定要删除吗?", async () => {
    if (selectedGateways.value.length > 0) {
      const res = await http.post(api.batchDel, { Ids: selectedGateways.value.map((p) => p.Id) });
      if (res.success) {
        ElMessage.success("删除成功!");
        fetchData();
      }
    } else {
      ElMessage.warning("请选择删除项!");
    }
  });
};

const handleEditRow = (row: GatewayConfigDto) => {
  editGateway.value = { ...row };
  detailRef.value?.refreshGateway(editGateway.value.Id);
  showDetailForm.value = true;
};

const handleDeleteRow = async (row: GatewayConfigDto) => {
  showConfirm("你确定要删除吗?", async () => {
    var res = await http.post(api.delete, { id: row.Id });
    if (res.success) {
      fetchData();
    }
  });
};

const handlePublish = async (row: GatewayConfigDto) => {
  showConfirm("你确定要发布吗?", async () => {
    var res = await http.post(`${api.publish}/${row.Id}`);
    if (res.success) {
      ElMessage.success("发布成功");
    }
  });
};

const handleViewHistory = async (row: GatewayConfigDto) => {
  showHistoryForm.value = true;
  nextTick(() => {
    editGateway.value = { ...row };
    publishListRef.value?.loadPublishHistory(editGateway.value.ProjectCode || "");
  });
};

const handleSearch = () => {
  fetchData();
};

const handleSelectionChange = (selection: GatewayConfigDto[]) => {
  selectedGateways.value = selection;
};

const handlePageChange = (page: number) => {
  queryParams.pageIndex = page;
  fetchData();
};

const handleClose = (refresh: boolean) => {
  if (refresh) {
    fetchData();
  }
  showDetailForm.value = false;
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.el-header {
  background-color: #f5f7fa;
  padding: 20px;
}
</style>
