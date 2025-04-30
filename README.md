# GatewayOcelotWeb

## 项目介绍

GatewayOcelotWeb 是一个基于 Vue3 + Vite 构建的 Ocelot 网关配置管理前端项目。该项目提供了友好的用户界面，用于管理和配置 Ocelot API 网关的各项功能。

## 功能特性

- 🚀 网关全局配置管理
  - 基础路径（BaseUrl）配置
  - 项目信息管理
- 🔒 认证管理
  - 认证提供者配置
  - 认证参数设置
- ⚡ 限流控制
  - 自定义限流规则
  - 限流提示信息配置
  - HTTP 状态码设置
- 🛠️ 路由配置
  - 动态路由管理
  - 路由规则配置

## 技术栈

- 核心框架：Vue 3.5.x
- 构建工具：Vite 6.x
- UI 框架：Element Plus 2.9.x
- 路由管理：Vue Router 4.x
- 开发语言：TypeScript
- 工具库：
  - vue-draggable-plus：拖拽功能支持
  - vue-json-pretty：JSON 数据展示
  - axios：HTTP 请求处理
  - windicss：原子化 CSS 框架

## 快速开始

### 环境要求

- Node.js >= 16.0.0
- pnpm >= 8.0.0（推荐）

### 安装

```bash
# 安装依赖
pnpm install
```

### 开发

```bash
# 启动开发服务器
pnpm dev
```

### 构建

```bash
# 构建生产版本
pnpm build
```

## 项目结构

```
├── src/                    # 源代码目录
│   ├── views/gateway/      # 网关配置相关视图
│   ├── components/         # 公共组件
│   ├── utils/              # 工具函数
│   └── router/             # 路由配置
├── mock/                   # 模拟数据
├── public/                 # 静态资源
└── vite.config.ts         # Vite 配置文件
```

## 许可证

[MIT License](LICENSE)
