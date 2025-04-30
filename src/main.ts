import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "element-plus/dist/index.css";
import "virtual:windi.css";
import "@/style.css";
import * as Icons from "@element-plus/icons-vue"; // 引入所有图标

const app = createApp(App);

// 全局注册所有图标组件
Object.keys(Icons).forEach((key) => {
  app.component(key, Icons[key as keyof typeof Icons]);
});

app.use(router);
app.mount("#app");
