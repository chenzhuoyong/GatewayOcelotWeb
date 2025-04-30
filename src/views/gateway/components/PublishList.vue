<template>
  <el-table :border="true" :highlight-current-row="true" :data="tableData" style="width: 100%">
    <el-table-column prop="ProjectName" label="项目名称"></el-table-column>
    <el-table-column prop="ProjectCode" label="项目编码"></el-table-column>
    <el-table-column prop="OperateTime" label="发布时间" :formatter="formatDate"></el-table-column>
    <el-table-column label="操作" :width="400">
      <template #default="scope">
        <el-button type="success" @click="viewConfig(scope.row)"> 配置内容 </el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog v-model="showPreviewForm" width="800" draggable>
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <h4 :id="titleId" :class="titleClass">配置内容预览</h4>
        <el-button @click="handleCopyJson">
          <el-icon><CopyDocument /></el-icon>
          复制
        </el-button>
      </div>
    </template>
    <Preview :json-data="previewData" />
  </el-dialog>
</template>

<script setup lang="ts">
import http from "@/utils/request";
import Preview from "./Preview.vue";
import { api, formatDate } from "../helper";
import { GatewayConfig } from "../type";

const tableData = ref<GatewayConfig[]>([]);
const showPreviewForm = ref(false);
const previewData = ref({});

const loadPublishHistory = async (projCode: string) => {
  const res = await http.post(`${api.publishHistory}/${projCode}`);
  if (res.success) {
    tableData.value = res.data;
  }
};

const viewConfig = async (row: GatewayConfig) => {
  previewData.value = row.Config;
  showPreviewForm.value = true;
};

const handleCopyJson = async () => {
  const json = JSON.stringify(previewData.value, null, 2);
  await navigator.clipboard.writeText(json);
  ElMessage.success("复制成功!");
};

defineExpose({
  loadPublishHistory,
});
</script>

<style></style>
