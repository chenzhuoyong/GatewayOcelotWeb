<!-- App.vue -->
<template>
  <div class="flex flex-col" style="height: calc(100vh - 2.5rem)">
    <div class="flex flex-row h-15 justify-end items-center">
      <el-button-group>
        <el-button type="primary" @click="handleImportJson">
          <el-icon><Upload /></el-icon>
          导入
        </el-button>
        <el-button type="primary" icon="View" @click="handlePreview">预览</el-button>
        <el-button type="primary" icon="Check" @click="handleSave">保存</el-button>
        <el-button type="primary" icon="Close" @click="handleClose">关闭</el-button>
      </el-button-group>
    </div>
    <div class="flex-1 py-2 px-4 rounded border overflow-auto">
      <el-tabs v-model="activeName">
        <el-tab-pane label="全局配置" name="tab-global">
          <Global ref="globalRef"></Global>
        </el-tab-pane>
        <el-tab-pane label="路由配置" name="tab-route">
          <Routes ref="routesRef"></Routes>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <el-dialog v-model="showPreviewForm" width="800" draggable>
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <h4 :id="titleId" :class="titleClass">配置内容预览</h4>
        <div class="flex gap-2">
          <el-button @click="handleImportJson">
            <el-icon><Upload /></el-icon>
            导入
          </el-button>
          <el-button @click="handleExportJson">
            <el-icon><Download /></el-icon>
            导出
          </el-button>
        </div>
      </div>
    </template>
    <Preview ref="previewRef" :json-data="previewData" />
  </el-dialog>
</template>

<script setup lang="ts">
import http from "@/utils/request";
import Global from "./Global.vue";
import Routes from "./Routes.vue";
import Preview from "./Preview.vue";
import { copyText, pasteText } from "@/utils/clipboard";
import { Upload, Download, CopyDocument } from "@element-plus/icons-vue";

import {
  api,
  mergeObjects,
  defaultGateway,
  generateGUID,
  defaultDownstreamHostAndPorts,
  defaultAuthenticationOptions,
  defaultRateLimitOptions,
  defaultLoadBalancerOptions,
  defaultUpstreamHeaderTemplatesOptions,
  showConfirm,
  convertNullToDefaults,
  jsonToCapitalizedObject,
} from "../helper";
import { useStore } from "../store";
import { ElMessage } from "element-plus";
import { Config, RouteConfig } from "../type";

interface IProps {
  id: string;
}

const emit = defineEmits<{
  (e: "onClose", isChange: boolean): void;
}>();

const routesRef = useTemplateRef("routesRef");
const showPreviewForm = ref(false);
const activeName = ref("tab-global");
const isChange = ref(false);

const props = defineProps<IProps>();

const store = useStore();
const isEdit = ref(false);

const loadGateway = async (id: string) => {
  isEdit.value = id === "" ? false : true;
  if (id) {
    var res = await http.get(`${api.detail}/${id}`);
    if (res.success) {
      store.setGateway(res.data);
    }
  } else {
    const gateway = JSON.parse(JSON.stringify(defaultGateway));
    store.setGateway(gateway);
  }
};

const refreshGateway = async (id: string) => {
  await loadGateway(id);
  activeName.value = "tab-global";
  routesRef.value?.InitActiveRoute();
};

defineExpose({ refreshGateway });

const previewData = computed(() => {
  const data = {
    GlobalConfiguration: store.state.Config.GlobalConfiguration,
    Routes: store.state.Config.Routes.filter((x) => x.Enabled),
  };
  return data;
});

onMounted(() => {
  refreshGateway(props.id);
});

const handleSave = async () => {
  isChange.value = true;
  let saveData = { ...store.state };
  let saveUrl = isEdit.value ? api.edit : api.add;
  if (!isEdit.value) {
    delete saveData.Id;
  }
  const res = await http.post(saveUrl, saveData);
  if (res.success) {
    if (!isEdit.value) {
      isEdit.value = true;
      store.state.Id = res.data.id;
    }
    ElMessage.success("保存成功!");
  }
};

const handlePreview = () => {
  showPreviewForm.value = true;
};

const handleClose = () => {
  emit("onClose", isChange.value);
};

// const handleCopyJson = async () => {
//   try {
//     let copyData = JSON.parse(JSON.stringify(store.state.Config));
//     if (copyData.routes && copyData.routes.length > 0) {
//       copyData.routes = copyData.routes.filter((x: any) => x.enabled);
//       copyData.routes.forEach((route: any) => {
//         delete route.id;
//         delete route.name;
//         delete route.active;
//         delete route.enabled;
//       });
//     }
//     const json = JSON.stringify(copyData, null);
//     await copyText(json);
//     ElMessage.success("复制成功!");
//   } catch {
//     ElMessage.success("复制失败!");
//   }
// };

// 从剪切板加载的方法
const loadFromClipboard = async () => {
  showConfirm("你确定要从粘贴板加载吗?", async () => {
    try {
      const clipboardText = await pasteText();
      var clipboardData = jsonToCapitalizedObject(clipboardText) as Config;
      const newConfig = mergeObjects(store.state.Config, clipboardData) as Config;
      if (newConfig.Routes && newConfig.Routes.length > 0) {
        newConfig.Routes.forEach((route: RouteConfig, index: number) => {
          if (!route.Id) {
            route.Id = generateGUID();
            route.Active = false;
            route.Enabled = true;
            route.Name = `路由${index + 1}`;
          }
          if (!route.DownstreamHostAndPorts) {
            route.DownstreamHostAndPorts = defaultDownstreamHostAndPorts;
          }
          if (!route.AuthenticationOptions) {
            route.AuthenticationOptions = defaultAuthenticationOptions;
          }
          if (!route.RateLimitOptions) {
            route.RateLimitOptions = defaultRateLimitOptions;
          }
          if (!route.LoadBalancerOptions) {
            route.LoadBalancerOptions = defaultLoadBalancerOptions;
          }
          if (!route.UpstreamHeaderTemplates) {
            route.UpstreamHeaderTemplates = defaultUpstreamHeaderTemplatesOptions;
          }
        });
      }

      store.state.Config = convertNullToDefaults(newConfig);
      routesRef.value?.InitActiveRoute();
      ElMessage.success("粘贴成功");
    } catch (error: any) {
      ElMessage.error("粘贴失败");
    }
  });
};

const handleExportJson = () => {
  try {
    let exportData = JSON.parse(JSON.stringify(store.state.Config));
    if (exportData.routes && exportData.routes.length > 0) {
      exportData.routes = exportData.routes.filter((x: any) => x.enabled);
      exportData.routes.forEach((route: any) => {
        delete route.id;
        delete route.name;
        delete route.active;
        delete route.enabled;
      });
    }
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // 创建一个隐藏的文件选择对话框
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.style.display = "none";
    // 设置为保存对话框
    fileInput.setAttribute("nwsaveas", "");
    // 设置默认文件名：项目编号_项目名称_日期
    const defaultFileName = `${store.state.ProjectCode || "gateway"}_${store.state.ProjectName || "config"}_${
      new Date().toISOString().split("T")[0]
    }.json`;
    fileInput.setAttribute("nwworkingdir", "");

    // 使用showSaveFilePicker API来选择保存路径
    const saveFile = async () => {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: defaultFileName,
          types: [
            {
              description: "JSON Files",
              accept: { "application/json": [".json"] },
            },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(json);
        await writable.close();
        ElMessage.success("导出成功!");
      } catch (err: any) {
        // 用户取消选择时不显示错误
        if (err.name !== "AbortError") {
          ElMessage.error("导出失败!");
        }
      } finally {
        URL.revokeObjectURL(url);
      }
    };

    // 检查是否支持 showSaveFilePicker API
    if ("showSaveFilePicker" in window) {
      saveFile();
    } else {
      // 降级方案：使用传统的下载方式
      const link = document.createElement("a");
      link.href = url;
      link.download = defaultFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      ElMessage.success("导出成功!");
    }
  } catch (error) {
    ElMessage.error("导出失败!");
  }
};

const handleImportJson = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const jsonText = event.target?.result as string;
          // const clipboardData = jsonToCapitalizedObject(jsonText) as Config;
          const clipboardData = JSON.parse(jsonText) as Config;

          const newConfig = mergeObjects(store.state.Config, clipboardData) as Config;

          if (newConfig.Routes && newConfig.Routes.length > 0) {
            newConfig.Routes.forEach((route: RouteConfig, index: number) => {
              if (!route.Id) {
                route.Id = generateGUID();
                route.Active = false;
                route.Enabled = true;
                route.Name = `路由${index + 1}`;
              }
              if (!route.DownstreamHostAndPorts) {
                route.DownstreamHostAndPorts = defaultDownstreamHostAndPorts;
              }
              if (!route.AuthenticationOptions) {
                route.AuthenticationOptions = defaultAuthenticationOptions;
              }
              if (!route.RateLimitOptions) {
                route.RateLimitOptions = defaultRateLimitOptions;
              }
              if (!route.LoadBalancerOptions) {
                route.LoadBalancerOptions = defaultLoadBalancerOptions;
              }
              if (!route.UpstreamHeaderTemplates) {
                route.UpstreamHeaderTemplates = defaultUpstreamHeaderTemplatesOptions;
              }
            });
          }

          store.state.Config = convertNullToDefaults(newConfig);
          routesRef.value?.InitActiveRoute();
          ElMessage.success("导入成功!");
        } catch (error) {
          ElMessage.error("导入失败: 文件格式不正确!");
        }
      };
      reader.readAsText(file);
    } catch (error) {
      ElMessage.error("导入失败!");
    }
  };
  input.click();
};
</script>
<style scoped>
.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
}
</style>
