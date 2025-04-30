<template>
  <div class="mb-2">
    <div
      @click="$emit('edit-route', route)"
      class="bg-light-50 py-2 px-4 rounded border flex flex-col mb-2 text-sm hover:bg-blue-50"
      :class="[route.Active ? 'bg-blue-100' : '']"
    >
      <div class="rounded flex items-center">
        <div class="handle flex-1 cursor-pointer flex items-center text-gray-600">
          <!-- <el-icon :size="14"><Menu /></el-icon>
          <span class="mr-1"></span> -->
          <span>{{ route.Name }}</span>
        </div>
        <span class="w-16 text-gray-400 text-xs">{{ route.Enabled ? "已启用" : "已停用" }}</span>
        <el-button-group>
          <el-button type="danger" size="small" @click.stop="$emit('delete', route)"> 删除 </el-button>
        </el-button-group>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouteConfig } from "../type";

const props = defineProps<{
  route: RouteConfig;
}>();

defineOptions({
  name: "StepRoute",
});
</script>
