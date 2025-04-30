<template>
  <div class="h-120 overflow-auto">
    <vue-json-pretty :data="jsonData"></vue-json-pretty>
  </div>
</template>

<script lang="ts" setup>
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

const props = defineProps({
  jsonData: {
    type: Object,
    default: () => {},
  },
});
</script>

<style scoped></style>
