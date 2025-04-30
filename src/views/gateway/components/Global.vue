<template>
  <el-form label-width="9rem" inline>
    <el-row>
      <el-form-item label="项目编码">
        <el-input v-model="state.ProjectCode" clearable></el-input>
      </el-form-item>
      <el-form-item label="项目名称">
        <el-input v-model="state.ProjectName" clearable></el-input>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item label="基础路径">
        <el-input
          style="width: 51rem !important"
          v-model="state.Config.GlobalConfiguration.BaseUrl"
          placeholder="BaseUrl"
          clearable
        ></el-input>
      </el-form-item>
    </el-row>
    <el-divider class="text-gray-500" content-position="left">限流配置</el-divider>
    <el-form-item label="是否禁用限流头信息">
      <el-switch
        style="width: 4rem !important"
        v-model="state.Config.GlobalConfiguration.RateLimitOptions.DisableRateLimitHeaders"
      ></el-switch>
    </el-form-item>
    <el-form-item label="限流提示信息">
      <el-input v-model="state.Config.GlobalConfiguration.RateLimitOptions.QuotaExceededMessage" clearable />
    </el-form-item>
    <el-form-item label="限流HTTP状态码">
      <el-input v-model="state.Config.GlobalConfiguration.RateLimitOptions.HttpStatusCode" clearable />
    </el-form-item>
    <el-divider content-position="left">认证配置</el-divider>
    <el-form-item label="认证提供者密钥">
      <el-input
        v-model="state.Config.GlobalConfiguration.AuthenticationOptions.AuthenticationProviderKey"
        placeholder="请输入认证提供者密钥"
        clearable
      ></el-input>
    </el-form-item>
    <el-row>
      <el-form-item label="允许的范围">
        <el-form-item
          v-for="(scope, index) in state.Config.GlobalConfiguration.AuthenticationOptions.AllowedScopes"
          :key="index"
        >
          <el-input
            class="mt-1"
            v-model="state.Config.GlobalConfiguration.AuthenticationOptions.AllowedScopes[index]"
            placeholder="请输入允许的范围"
            clearable
          ></el-input>
          <el-button class="ml-1" type="danger" @click="removeScope(index)">删除</el-button>
        </el-form-item>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item>
        <el-button type="primary" @click="addScope">添加范围</el-button>
      </el-form-item>
    </el-row>
  </el-form>

  <!-- {{ state }} -->
</template>

<script setup lang="ts">
import { defaultGlobalAuthenticationOptions, defaultGlobalRateLimitOptions } from "../helper";
import { useStore } from "../store";
const state = useStore().state;

if (!state.Config.GlobalConfiguration.RateLimitOptions) {
  state.Config.GlobalConfiguration.RateLimitOptions = { ...defaultGlobalRateLimitOptions };
}
if (!state.Config.GlobalConfiguration.AuthenticationOptions) {
  state.Config.GlobalConfiguration.AuthenticationOptions = { ...defaultGlobalAuthenticationOptions };
}

// 添加允许的范围
const addScope = () => {
  state.Config.GlobalConfiguration.AuthenticationOptions.AllowedScopes.push("");
};

// 删除允许的范围
const removeScope = (index: number) => {
  state.Config.GlobalConfiguration.AuthenticationOptions.AllowedScopes.splice(index, 1);
};
</script>
