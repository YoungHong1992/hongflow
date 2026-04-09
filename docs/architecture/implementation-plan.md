# Implementation Plan

`plan.md` 给出了完整的一期产品方向。当前初始化将它收敛为一个可持续推进的技术实施计划，优先保证仓库可运行、结构可扩展、社区可以直接参与。

## Phase 0: 仓库底座

- 完成 monorepo 初始化
- 固定 `web / api / worker / packages/*` 结构
- 提供 Docker Compose、环境变量、CI 和开源元信息
- 建立 workflow schema、节点目录、provider registry 的初始约束

## Phase 1: 项目与画布主线

- 项目、画布、workflow 的 CRUD 与持久化
- React Flow 画布壳层、节点目录、属性面板
- 预置商品视觉模板 workflow

## Phase 2: 素材系统

- 资产上传与本地文件存储
- 缩略图生成任务
- 商品图 / 参考图 / 品牌图节点联通

## Phase 3: 运行执行

- BullMQ 任务入队与状态跟踪
- Provider Router 统一输入输出
- 至少 2 家图像 provider 接入

## Phase 4: 结果与导出

- 结果画廊
- 多变体对比与收藏
- 图片导出、示例 workflow、发布文档

## 当前初始化交付

- 根级工程配置、共享 tsconfig、工作区脚本
- `web` 创意工作台壳层
- `api` 基础 REST 接口与数据库迁移
- `worker` 运行队列消费者
- `shared / nodes / providers / ui` 基础包
- `examples/workflows` 示例
- `docs`、`LICENSE`、`CONTRIBUTING`、`CODE_OF_CONDUCT`
