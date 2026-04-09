# PROJECTS_INDEX.md

## 工作区概览

- **更新时间**：2026-04-09
- **工作区根目录**：`/home/yanghong/Projects/hongflow`
- **工作区类型**：单项目工作区；当前仓库根目录即项目根目录
- **模板目录**：`_template/`，只读，作为 `PROJECT.md` / `PROGRESS.md` 模板源
- **静默目录**：当前工作区内未启用 `plan/` 与 `archive/` 目录
- **正式状态账本**：`PROJECTS_INDEX.md`、`PROJECT.md`、`PROGRESS.md`

## 环境摘要

- **目标命令环境**：Windows PowerShell 5.1 兼容优先
- **核心版本**：Git `2.52.0`、Python `3.14.0`、Node.js `24.12.0`
- **网络代理**：`http://127.0.0.1:10808`
- **协作语言**：中文

## 目录边界

- 当前会话涉及的业务代码、配置与文档修改，均限定在当前项目根目录内。
- 工具专属文档如 `AGENTS.md`、`CLAUDE.md`、`GEMINI.md` 仅作只读参考，不承载项目状态。
- 项目状态、阶段进度、结构收敛与后续维护，统一记录在本索引与项目级文档中。

## 项目清单

| 项目名 | 路径 | 状态 | 简述 | 项目文档 |
|------|------|------|------|------|
| HongFlow Community | `.` | 进行中 | 面向商品视觉与品牌内容生产的开源、自部署 AI 工作台 | `PROJECT.md` / `PROGRESS.md` |

## 当前活跃项目

### HongFlow Community

- **仓库路径**：`/home/yanghong/Projects/hongflow`
- **Git 远端**：`git@github.com:YoungHong1992/hongflow.git`
- **核心栈**：React、React Flow、Fastify、BullMQ、PostgreSQL、Redis、pnpm workspace
- **当前阶段**：完成一期工程底座初始化，正在按新增约束文档收敛项目台账与目录说明
- **下一优先级**：
  - 补齐真实数据库 / 队列依赖并恢复完整运行链路
  - 将项目、画布、workflow 从骨架状态推进到可真实持久化
  - 持续把阶段成果同步到 `PROJECT.md` 与 `PROGRESS.md`
