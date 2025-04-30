import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { viteMockServe } from "vite-plugin-mock";
import WindiCSS from "vite-plugin-windicss";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import dts from "vite-plugin-dts";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  resolve: {
    // 配置别名
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      include: ["src/**/*"],
    }),
    WindiCSS({
      scan: true, // 扫描 class
      preflight: true, // 启用预设样式
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ["vue", "vue-router"], // 自动导入 Vue 和 Vue Router 的方法
      dts: "src/auto-imports.d.ts", // 自动生成类型声明文件
    }),
    // 按需加载 Element Plus 组件
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    viteMockServe({
      mockPath: "mock", // 指定mock文件存放目录
      enable: true,
      logger: true, // 控制台显示请求日志
      watchFiles: true, // 监听mock文件修改热更新
    }),
  ],
  server: {
    host: "0.0.0.0",
    port: 3000,
    open: true,
    cors: true,
  },
  build: {
    lib: {
      entry: "./src/index.ts", // 你的入口文件
      name: "ChaintEdpNextGateway",
      fileName: (format) => `chaint-edpnext-gateway.${format}.js`,
      formats: ["es"],
    },
    rollupOptions: {
      external: ["vue", "vue-router", "element-plus", "dayjs", "axios", "@element-plus/icons-vue"],
      output: {
        globals: {
          vue: "Vue",
          "vue-router": "VueRouter",
          pinia: "Pinia",
          "element-plus": "ElementPlus",
          dayjs: "dayjs",
          axios: "axios",
          "@element-plus/icons-vue": "ElementPlusIconsVue",
        },
      },
    },
    // cssCodeSplit: true, // 将 CSS 提取到单独的文件中
  },
});
