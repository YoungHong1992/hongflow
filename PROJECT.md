# HongFlow Community — PROJECT.md

## 项目概述

HongFlow Community 是一个面向商品视觉与品牌内容生产的开源、自部署 AI 工作台。第一期目标是完成社区版底座：让用户可以在媒体富节点画布中组织商品素材、提示词与生成流程，并逐步跑通“上传素材 -> 编排 workflow -> 批量生成 -> 对比筛选 -> 导出”的闭环。

**创建日期**：2026-04-09
**状态**：进行中

---

## 文件结构

```text
hongflow/
├── PROJECTS_INDEX.md
├── PROJECT.md
├── PROGRESS.md
├── apps/
│   ├── web/               # React + React Flow 前端工作台
│   ├── api/               # Fastify API 与迁移脚本
│   └── worker/            # BullMQ 任务执行器
├── packages/
│   ├── shared/            # schema / domain / constants
│   ├── nodes/             # 内置节点定义
│   ├── providers/         # provider adapter 协议与实现骨架
│   └── ui/                # 公共 UI 组件
├── docs/                  # 非状态类说明文档
├── examples/workflows/    # 示例 workflow
├── infra/docker/          # 各服务 Dockerfile
└── _template/             # 项目文档模板，只读
```

---

## 关联资源

- 产品规划原文：[plan.md](/home/yanghong/Projects/hongflow/plan.md)
- 实施计划：[implementation-plan.md](/home/yanghong/Projects/hongflow/docs/architecture/implementation-plan.md)
- 架构概览：[overview.md](/home/yanghong/Projects/hongflow/docs/architecture/overview.md)
- GitHub 仓库：`git@github.com:YoungHong1992/hongflow.git`

---

## 核心内容

### 产品定位

- 面向商品图、包装图、品牌图、参考图等视觉素材的 AI 工作台
- 优先服务自部署社区版，而不是多租户 SaaS 或通用自动化平台
- 当前阶段聚焦工程底座与单机可运行闭环

### 当前技术栈

- **前端**：React、TypeScript、Vite、React Flow、Zustand、TanStack Query、Tailwind CSS
- **后端**：Fastify、TypeScript、PostgreSQL、BullMQ、Redis
- **共享层**：`packages/shared`、`packages/nodes`、`packages/providers`、`packages/ui`
- **部署**：pnpm workspace、Docker Compose、独立 Dockerfile

### 当前工程实现状态

#### 1. Monorepo 与工程骨架

- 已完成 pnpm workspace 初始化
- 已建立 `apps/` + `packages/` + `docs/` + `examples/` + `infra/` 结构
- 已补齐 `LICENSE`、`README`、`CONTRIBUTING`、`CODE_OF_CONDUCT`、CI 模板

#### 2. 前端工作台

- 已有可运行的创意工作台壳层
- 已实现左侧节点目录、中央画布、右侧属性面板、底部状态栏
- 已预置商品主图生成模板节点与 React Flow 交互

#### 3. API 服务

- 已实现项目、画布、workflow、run、provider 配置、节点目录、资产上传等基础接口骨架
- 路由已按领域拆分为 `system / projects / boards / runs / providers / assets`
- 公共 JSON 序列化、默认 workflow、降级 demo 数据已从路由实现中抽离
- 已有 PostgreSQL 初始化迁移脚本
- 当前为便于演示，加入了数据库不可用时的降级返回逻辑，用于渲染 demo 项目

#### 4. Worker 与 Provider

- 已实现 BullMQ worker 骨架
- Worker 已拆分为连接层、日志层、提示词解析、run 执行器和入口监听层
- 已接入 `mock` provider 和 `openai` 占位 adapter
- 当前真实运行依赖 PostgreSQL 与 Redis

#### 5. 示例与文档

- 已提供 3 个示例 workflow
- 已提供 Getting Started、Docker Compose、Architecture 等初版文档
- 当前项目状态与阶段信息已经开始收敛到 `PROJECT.md` / `PROGRESS.md`

#### 6. 前端工作台结构

- `App.tsx` 已降为应用入口
- 工作台页面已拆分为查询 hook、画布状态 hook、头部、左栏、画布区、底栏和页面组装组件
- 当前 UI 表现保持不变，但后续接入真实数据的结构成本已明显降低

### 当前运行方式

#### 演示模式

- `web` 可直接运行
- `api` 可在数据库与 Redis 不可用时以降级模式返回 demo 项目列表
- 适合先查看 UI 壳层与整体交互布局

#### 完整模式

- 需要 PostgreSQL 与 Redis
- 理想启动方式是 `docker compose up -d --build`
- 当前开发服务器存在 `postgres` 镜像拉取失败问题，导致 Compose 完整链路暂未恢复

### 已知问题与约束

- 当前开发服务器只能稳定拉取 `redis` 镜像，`postgres:16-alpine` 受镜像源影响拉取失败
- API 当前健康检查与真实持久化依赖尚未完全解耦
- Worker 未进入持续运行状态，生成任务链路仍属于骨架级实现
- 当前仓库即项目根目录，后续所有状态更新必须优先同步到本文件与 `PROGRESS.md`

### 下一阶段建议

1. 先恢复 PostgreSQL / Redis 的可用运行环境，解除演示模式限制
2. 推进项目、画布、workflow 的真实 CRUD 联调
3. 接入素材缩略图与真实 run 状态流转
4. 再进入结果画廊、导出、Provider 扩展

---

## 备注

- `AGENTS.md`、`CLAUDE.md`、`GEMINI.md` 为工具初始化说明，只读，不记录项目状态。
- `docs/` 目录承载通用说明；真正的项目状态以 `PROJECTS_INDEX.md`、`PROJECT.md`、`PROGRESS.md` 为准。

---

## 进度记录

| 日期 | 说明 |
|------|------|
| 2026-04-09 | 初始化 HongFlow Community 工程底座 |
| 2026-04-09 | 建立全局索引与项目级状态文档，按新增约束重新收敛当前工程 |
| 2026-04-09 | 按约束对 `api / worker / web` 完成结构级重整，保持现有行为不变 |
