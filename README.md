# HongFlow Community

HongFlow Community 是一个面向商品视觉与品牌内容生产的开源 AI 工作台。当前仓库已完成一期工程底座初始化，覆盖 `web + api + worker + shared packages + Docker Compose` 的最小可运行结构，作为后续社区版迭代的起点。

## 状态文档

- 全局索引：[PROJECTS_INDEX.md](/home/yanghong/Projects/hongflow/PROJECTS_INDEX.md)
- 项目说明：[PROJECT.md](/home/yanghong/Projects/hongflow/PROJECT.md)
- 进度追踪：[PROGRESS.md](/home/yanghong/Projects/hongflow/PROGRESS.md)

## 当前初始化范围

- `apps/web`: React + React Flow 画布壳层与创意工作台 UI
- `apps/api`: Fastify API、项目/画布/workflow/run/provider 基础接口
- `apps/worker`: BullMQ worker 与 provider 路由骨架
- `packages/shared`: 领域模型、schema、队列常量
- `packages/nodes`: 内置节点目录
- `packages/providers`: provider adapter 协议与 mock/OpenAI 适配器骨架
- `packages/ui`: 公共 UI 组件
- `docker-compose.yml`: PostgreSQL、Redis、API、Worker、Web 一键启动

## 快速开始

```powershell
Copy-Item .env.example .env
pnpm install
pnpm build
docker compose up -d
```

本地开发：

```powershell
Copy-Item .env.example .env
pnpm install
pnpm dev
```

默认地址：

- Web: `http://localhost:3000`
- API: `http://localhost:3001/api`
- Health: `http://localhost:3001/health`

## 已初始化的核心能力

- Monorepo 与共享 TypeScript 配置
- 项目、画布、workflow、run 的基础数据模型
- PostgreSQL 初始化迁移脚本
- BullMQ 运行队列与 Worker 处理器
- 本地文件上传存储骨架
- 节点目录与 provider registry
- 初版开源文档、CI、Issue 模板

## 下一阶段

当前仓库是 Phase 0/1 的启动底座。后续优先顺序见 [implementation-plan.md](/home/yanghong/Projects/hongflow/docs/architecture/implementation-plan.md)。
