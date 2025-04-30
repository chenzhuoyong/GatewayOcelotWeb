import { RouteRecordRaw } from "vue-router";
import "virtual:windi.css";
import "@/style.css";

const routes: RouteRecordRaw[] = [
  {
    path: "/gateway",
    name: "gateway",
    component: () => import("@/views/gateway/index.vue"),
    meta: {
      title: "网关配置",
      requiresAuth: false,
      icon: "SwitchFilled",
    },
  },
];

export { routes };
