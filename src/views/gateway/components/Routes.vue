<template>
  <div class="flex bg-gray-100 gap-2 overflow-hidden" style="height: calc(100vh - 11rem)">
    <div class="w-84 bg-white p-3 rounded border overflow-auto">
      <el-button type="primary" @click="addRoute" class="mb-2">新增路由</el-button>
      <VueDraggable v-model="state.Config.Routes" handle=".handle" :animation="150" group="first-level-group">
        <RouteNode
          v-for="route in state.Config.Routes"
          :key="route.Id"
          :route="route"
          @edit-route="editRoute"
          @delete="deleteRoute"
        ></RouteNode>
      </VueDraggable>
    </div>
    <div class="flex-1 bg-white p-4 rounded border overflow-auto">
      <el-form :model="routeConfig" label-width="9rem" inline>
        <!-- 基础信息 -->
        <el-form-item label="路由名称">
          <el-input v-model="routeConfig.Name" placeholder="请输入路由名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch v-model="routeConfig.Enabled"></el-switch>
        </el-form-item>
        <el-form-item label="下游协议">
          <el-select v-model="routeConfig.DownstreamScheme" placeholder="请选择下游协议" clearable>
            <el-option label="HTTP" value="http"></el-option>
            <el-option label="HTTPS" value="https"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上游HTTP方法">
          <el-select v-model="routeConfig.UpstreamHttpMethod" multiple placeholder="请选择上游HTTP方法" clearable>
            <el-option label="GET" value="GET"></el-option>
            <el-option label="POST" value="POST"></el-option>
            <el-option label="PUT" value="PUT"></el-option>
            <el-option label="DELETE" value="DELETE"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下游路径模板">
          <el-input v-model="routeConfig.DownstreamPathTemplate" placeholder="请输入下游路径模板" clearable></el-input>
        </el-form-item>
        <el-form-item label="上游路径模板">
          <el-input v-model="routeConfig.UpstreamPathTemplate" placeholder="请输入上游路径模板" clearable></el-input>
        </el-form-item>

        <el-tabs type="border-card" style="margin-top: 20px">
          <!-- DownstreamHostAndPorts -->
          <el-tab-pane label="下游主机">
            <el-form :model="routeConfig.DownstreamHostAndPorts" label-width="8rem" inline>
              <el-form-item v-for="(host, index) in routeConfig.DownstreamHostAndPorts" :key="index">
                <el-space direction="vertical">
                  <el-form-item label="主机地址">
                    <el-input v-model="host.Host" placeholder="请输入主机地址" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="端口号">
                    <el-input-number
                      v-model="host.Port"
                      :min="1"
                      :max="65535"
                      placeholder="请输入端口号"
                    ></el-input-number>
                  </el-form-item>
                  <el-form-item label="权重">
                    <el-input-number
                      v-model="host.Weight"
                      :min="1"
                      :max="100"
                      placeholder="请输入权重"
                    ></el-input-number>
                  </el-form-item>
                  <el-form-item label="协议类型">
                    <el-select v-model="host.Scheme" placeholder="请选择协议类型" clearable>
                      <el-option label="HTTP" value="http"></el-option>
                      <el-option label="HTTPS" value="https"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="健康检查路径">
                    <el-input v-model="host.HealthCheckPath" placeholder="请输入健康检查路径" clearable></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="danger" @click="removeHost(index)">删除</el-button>
                  </el-form-item>
                </el-space>
              </el-form-item>
              <el-row>
                <el-form-item>
                  <el-button type="primary" @click="addHost">添加主机</el-button>
                </el-form-item>
              </el-row>
            </el-form>
          </el-tab-pane>

          <!-- LoadBalancerOptions -->
          <el-tab-pane label="负载均衡">
            <el-form :model="routeConfig.LoadBalancerOptions" label-width="8rem" inline>
              <el-form-item label="负载均衡类型">
                <el-select v-model="routeConfig.LoadBalancerOptions.Type" placeholder="请选择负载均衡类型" clearable>
                  <el-option label="轮询" value="RoundRobin"></el-option>
                  <el-option label="最小连接" value="LeastConnection"></el-option>
                  <el-option label="会话保持" value="CookieSticky"></el-option>
                  <el-option label="权重分配" value="Weighted"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <!-- AuthenticationOptions -->
          <el-tab-pane label="认证配置">
            <el-form :model="routeConfig.AuthenticationOptions" label-width="8rem" inline>
              <el-form-item label="是否要求认证">
                <el-switch v-model="routeConfig.AuthenticationOptions.AuthenticationRequired"></el-switch>
              </el-form-item>
              <el-form-item label="认证提供者密钥">
                <el-input
                  v-model="routeConfig.AuthenticationOptions.AuthenticationProviderKey"
                  placeholder="请输入认证提供者密钥"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="允许的范围">
                <el-form-item v-for="(scope, index) in routeConfig.AuthenticationOptions.AllowedScopes" :key="index">
                  <el-input
                    class="mt-1"
                    v-model="routeConfig.AuthenticationOptions.AllowedScopes[index]"
                    placeholder="请输入允许的范围"
                    clearable
                  ></el-input>
                  <el-button class="ml-1" type="danger" @click="removeScope(index)">删除</el-button>
                </el-form-item>
              </el-form-item>
              <el-row>
                <el-form-item>
                  <el-button type="primary" @click="addScope">添加范围</el-button>
                </el-form-item>
              </el-row>
            </el-form>
          </el-tab-pane>

          <!-- RateLimitOptions -->
          <el-tab-pane label="限流配置">
            <el-form :model="routeConfig.RateLimitOptions" label-width="8rem" inline>
              <el-form-item label="是否启用限流">
                <el-switch
                  style="width: 4rem !important"
                  v-model="routeConfig.RateLimitOptions.EnableRateLimiting"
                ></el-switch>
              </el-form-item>

              <el-form-item label="允许的请求数">
                <el-input-number
                  style="width: 7rem !important"
                  v-model="routeConfig.RateLimitOptions.PermitLimit"
                  :min="1"
                  placeholder="请输入允许的请求数"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="限流周期（秒）">
                <el-input-number
                  style="width: 7rem !important"
                  v-model="routeConfig.RateLimitOptions.Period"
                  :min="1"
                  placeholder="请输入限流周期（秒）"
                ></el-input-number>
              </el-form-item>
              <el-row>
                <el-form-item label="客户端白名单">
                  <el-form-item v-for="(client, index) in routeConfig.RateLimitOptions.ClientWhitelist" :key="index">
                    <el-input
                      class="mt-1"
                      v-model="routeConfig.RateLimitOptions.ClientWhitelist[index]"
                      placeholder="请输入客户端白名单"
                      clearable
                    ></el-input>
                    <el-button type="danger" class="ml-1" @click="removeClient(index)">删除</el-button>
                  </el-form-item>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item>
                  <el-button type="primary" @click="addClient">添加客户端白名单</el-button>
                </el-form-item>
              </el-row>
            </el-form>
          </el-tab-pane>

          <!-- UpstreamHeaderTemplates -->
          <el-tab-pane label="请求头">
            <el-form :model="formItems" label-width="4rem" inline>
              <el-form-item v-for="(head, index) in formItems" :key="index">
                <el-form-item label="Key">
                  <el-input v-model="head.key" placeholder="请输入 Key" clearable></el-input>
                </el-form-item>
                <el-form-item label="值">
                  <el-input v-model="head.value" placeholder="请输入 Value" clearable></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="danger" @click="removeHeader(index)">删除</el-button>
                </el-form-item>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="addHeader">添加请求头</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import RouteNode from "./RouteNode.vue";
import { useStore } from "../store";
import { defaultRouteConfig } from "../helper";
import { UpstreamHeaderTemplatesOptions, RouteConfig } from "../type";
import { VueDraggable } from "vue-draggable-plus";

const state = useStore().state;

const routeConfig = ref<RouteConfig>({ ...defaultRouteConfig });

// 动态表单项
const formItems = ref<{ key: string; value: string }[]>([]);

// 将 UpstreamHeaderTemplates 转换为 formItems
const updateFormItems = () => {
  formItems.value = Object.entries(routeConfig.value.UpstreamHeaderTemplates).map(([key, value]) => ({
    key,
    value,
  }));
};

const updateHeaders = () => {
  const result: UpstreamHeaderTemplatesOptions = {};
  formItems.value.forEach((item) => {
    if (item.key && item.value) {
      result[item.key] = item.value;
    }
  });
  routeConfig.value.UpstreamHeaderTemplates = result;
};

// 添加主机
const addHost = () => {
  routeConfig.value.DownstreamHostAndPorts.push({
    Host: "",
    Port: 80,
    Weight: 1,
    Scheme: "http",
    HealthCheckPath: "",
  });
};

// 删除主机
const removeHost = (index: number) => {
  routeConfig.value.DownstreamHostAndPorts.splice(index, 1);
};

// 添加允许的范围
const addScope = () => {
  routeConfig.value.AuthenticationOptions.AllowedScopes.push("");
};

// 删除允许的范围
const removeScope = (index: number) => {
  routeConfig.value.AuthenticationOptions.AllowedScopes.splice(index, 1);
};

// 添加客户端白名单
const addClient = () => {
  routeConfig.value.RateLimitOptions.ClientWhitelist.push("");
};

// 删除客户端白名单
const removeClient = (index: number) => {
  routeConfig.value.RateLimitOptions.ClientWhitelist.splice(index, 1);
};

const UpdateHeader = () => {
  const result: UpstreamHeaderTemplatesOptions = {};
  formItems.value.forEach((item) => {
    if (item.key && item.value) {
      result[item.key] = item.value;
    }
    routeConfig.value.UpstreamHeaderTemplates = result;
  });
};

// 添加 Header
const addHeader = () => {
  formItems.value.push({
    key: "",
    value: "",
  });
};

// 删除 Header
const removeHeader = (index: number) => {
  formItems.value.splice(index, 1);
};

watch(
  () => formItems.value,
  () => {
    updateHeaders();
  },
  { deep: true } // 深度监听对象的变化
);

const addRoute = () => {
  const newRoute: RouteConfig = { ...defaultRouteConfig };
  state.Config.Routes.push(newRoute);
  editRoute(newRoute);
};

const editRoute = (currentRoute: RouteConfig) => {
  // console.log("编辑route", currentRoute);
  state.Config.Routes.filter((route) => {
    route.Active = false;
  });

  currentRoute.Active = true;
  routeConfig.value = currentRoute;
  updateFormItems();
};

const deleteRoute = (target: RouteConfig) => {
  state.Config.Routes = state.Config.Routes.filter((route) => route.Id !== target.Id);

  if (state.Config.Routes.length > 0) {
    editRoute(state.Config.Routes[0]);
  }
};

const InitActiveRoute = () => {
  if (state.Config.Routes.length > 0) {
    editRoute(state.Config.Routes[0]);
  }
};

defineExpose({
  InitActiveRoute,
});
</script>

<style>
.el-drawer__header {
  margin-bottom: 0px !important;
}
</style>
