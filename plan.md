下面是一版可直接拿去内部评审、拆任务、拉研发排期的 **第一期完整计划书：开源社区版**。
这版是在你前面确认过的方向上进一步收紧后的版本：保留“自部署友好、开源优先、社区优先、后续可衔接托管版”的原则，同时把产品明确聚焦到 **商品视觉 / 品牌内容生产工作台**，而不是通用 AI 编排平台。此前方案里已经明确了几个关键约束：开源主线不适合使用 tldraw；开源版应优先保证许可证合规、自部署便利和社区接受度；底层技术栈以 React Flow / Node.js / BullMQ / PostgreSQL / Docker Compose 为稳妥主线。

---

# 第一期完整计划书：开源社区版

## 1. 项目名称与定位

**项目暂定名**：HongFlow Community
**一句话定位**：
一个面向商品视觉与品牌内容生产的开源 AI 工作台，帮助用户把商品图、包装图、品牌参考图、模特图与生成流程组织在同一张画布上，完成多版本内容生产、筛选与导出。

**第一期版本属性**：
开源社区版、单租户、自部署优先、BYOK（Bring Your Own Key，用户自带 API Key）、面向个人开发者与小团队试用。

**不做的事**：
第一期不是通用 Dify/n8n 替代品，不做多人实时协作，不做模板交易市场，不做复杂计费，不做企业权限系统，不做 SaaS 多租户。这个取舍也符合此前“Phase 1 先做开源 MVP、先把自部署闭环跑通”的主线。

---

## 2. 目标用户

### 2.1 核心用户

第一期只服务三类人：

1. **电商视觉设计师 / 小团队**

   * 有大量商品图、包装图、详情图需求
   * 想批量做主图、场景图、卖点图
   * 需要快速试风格、试构图、试文案

2. **AI 创意工作流玩家**

   * 会用 Midjourney、Liblib、OpenAI 图像接口等工具
   * 需要一个可视化的方式管理素材、提示词、生成结果
   * 需要反复调参、分支对比、复用流程

3. **中小型代运营 / 品牌外包团队**

   * 想沉淀一套可复制的“出图流程”
   * 希望后续能迁移到托管版，但第一期先要求本地自部署可用

### 2.2 非目标用户

* 大型企业 IT 采购
* 强审批流和强权限组织
* 通用自动化编排用户
* 只想文本 Agent、不关心视觉生产的人群

---

## 3. 问题定义

当前用户在商品视觉生产里普遍有 5 个问题：

1. **素材分散**：商品图、包装图、品牌图、参考图分散在多个文件夹和多个工具里
2. **流程不可复用**：每次生成都从头试，难以沉淀
3. **结果不易对比**：同一轮出图缺少分支管理和快速筛选
4. **品牌一致性差**：不同人、不同轮次生成的结果风格漂移
5. **工具链割裂**：提示词、模型、图像处理、导出在多个工具之间来回切

第一期的任务不是把所有问题都解决，而是解决最核心的一条链路：

**“上传商品相关素材 → 在画布中组织生成流程 → 批量出多版结果 → 对比筛选 → 导出”**

---

## 4. 第一期开源版目标

## 4.1 北极星目标

让用户在 **30 分钟内完成首次部署并成功生成第一套商品视觉结果**。

## 4.2 阶段目标

第一期只达成 4 个目标：

1. **开源可部署**

   * Docker Compose 一键启动
   * 文档完整
   * 不依赖官方云端

2. **画布可编排**

   * 能拖拽素材节点
   * 能连接生成节点
   * 能保存和加载 workflow

3. **生产闭环跑通**

   * 至少支持一种商品图生成主流程
   * 至少支持一种变体批量生成能力
   * 至少支持导出最终图

4. **社区可参与**

   * 有清晰仓库结构
   * 有贡献指南
   * 有节点扩展规范雏形

---

## 5. 第一期开源版范围

## 5.1 必做范围

### A. 项目与画布

* 新建项目
* 项目下创建画布
* 画布无限拖拽、缩放、节点连接
* 工作流保存 / 加载 / 导出 JSON

### B. 素材管理

* 上传商品图
* 上传包装图 / 平面图
* 上传参考图
* 上传品牌图 / logo
* 每个素材生成缩略图和基本元数据

### C. 基础节点

第一期只做 6 类节点：

1. **素材输入节点**

   * 商品图节点
   * 参考图节点
   * 品牌图节点

2. **文本节点**

   * Prompt 节点
   * 负向提示词节点
   * 风格说明节点

3. **生成节点**

   * 图像生成节点
   * 图像变体节点
   * 局部重绘节点（可选，若时间紧可顺延）

4. **控制节点**

   * 参数模板节点
   * 批量变体节点

5. **结果节点**

   * 输出结果节点
   * 对比结果节点

6. **导出节点**

   * 导出 PNG / JPG
   * 导出一组结果

### D. 运行执行

* 任务入队
* Worker 异步执行
* 运行日志
* 成功 / 失败状态
* 失败重试

### E. 用户自带 Key

* 支持配置至少 2 家模型提供方
* Key 仅存本地或用户自部署环境
* 不上传到官方服务器

### F. 文档与示例

* 本地部署指南
* 环境变量说明
* 5 个示例 workflow
* 常见问题 FAQ

## 5.2 明确不做

* 多人协作
* 评论审批
* 组织/角色权限
* 内置额度
* 模板市场
* 企业 SSO
* 复杂插件市场
* 云端账号系统
* WebSocket 协同
* K8s 官方支持

---

## 6. 产品形态

你发的截图已经说明，这个产品第一眼必须像“创意画布”，而不是“工程参数面板”。因此第一期前端采用 **媒体富节点画布**：节点既是数据节点，也是可视化素材卡片。这个方向与此前“通用工作流选 React Flow 更稳妥，且开源主线不使用 tldraw”的原则一致。

### 6.1 画布结构

画布分三层：

1. **素材层**

   * 商品、包装、参考、品牌图

2. **编排层**

   * Prompt、风格、参数模板、生成节点、批量节点

3. **结果层**

   * 结果卡片、对比卡片、导出卡片

### 6.2 节点交互原则

* 节点默认显示缩略图
* 结果节点支持多图预览
* 节点右侧属性栏统一编辑
* 连线尽量弱化工程感，增强“流程感”
* 每个节点都能看见最关键输入/输出，不要求用户点开很多层

---

## 7. 技术路线

## 7.1 前端

**推荐方案：React + React Flow + TypeScript**

原因：

* 更适合做媒体富节点和产品化 UI
* 比 LiteGraph 更容易做长期维护的面板体系
* 更适合后续平滑升级到托管版
* 同时保留开源友好和自部署可行性
  此前方案也已将 React Flow 归类为适合更通用、流程编排导向的平台，并明确 tldraw 不适合作为开源主线。

前端依赖建议：

* React
* TypeScript
* React Flow
* Zustand
* TanStack Query
* Tailwind CSS
* shadcn/ui 或等价组件库
* react-hook-form
* zod

## 7.2 后端

**推荐方案：Node.js + Fastify + TypeScript**

原因：

* 与前端统一 TypeScript
* 社区参与门槛低
* 易于拆 worker 和 API
* 符合此前后端主线方案 

## 7.3 异步执行

**BullMQ + Redis**

用途：

* 图像任务入队
* 批量变体任务拆分
* 失败重试
* 状态跟踪

## 7.4 数据库

**PostgreSQL**

存储：

* 项目
* 画布
* 节点数据
* workflow JSON
* 运行记录
* 素材元数据
* 导出记录
  这也符合此前“PostgreSQL + JSONB 适合 workflow 配置”的判断。

## 7.5 文件存储

第一期不强绑 MinIO，采用两级方案：

* 本地开发：本地磁盘
* 生产/进阶部署：S3 兼容接口

这样能降低首次部署难度。此前方案保留了 MinIO / S3 兼容存储的思路，但第一期社区版不应让部署链路过重。

## 7.6 部署

**Docker Compose 官方支持**

这是开源社区版第一期的刚需，不追求 K8s。此前方案也已明确“5 分钟上手”和 Docker Compose 一键部署是开源接受度的关键。

---

## 8. 系统架构

```text
Frontend (React + React Flow)
        |
        | HTTP
        v
API Server (Fastify)
        |
        +-- PostgreSQL (projects / boards / workflows / runs / assets metadata)
        |
        +-- Redis (queue / status / retry)
        |
        +-- Object Storage or Local FS (images / thumbnails / exports)
        |
        +-- Worker (provider router / image jobs / export jobs)
```

### 8.1 模块划分

**frontend**

* 画布模块
* 节点模块
* 素材模块
* 结果模块
* 设置模块

**api**

* 项目管理
* 画布管理
* workflow 管理
* run 管理
* provider key 管理
* 素材上传
* 导出服务

**worker**

* 图像生成任务
* 变体生成任务
* 导出任务
* 缩略图任务

**shared**

* schema
* 类型定义
* 节点协议
* provider adapter 接口

---

## 9. 领域模型

第一期只定义 7 个核心对象：

### 9.1 Project

* id
* name
* description
* createdAt
* updatedAt

### 9.2 Board

* id
* projectId
* name
* viewport
* createdAt
* updatedAt

### 9.3 Asset

* id
* projectId
* type: product / packaging / reference / brand / output
* storagePath
* metadata
* thumbnailPath

### 9.4 Workflow

* id
* boardId
* schemaVersion
* nodes
* edges
* variables

### 9.5 Run

* id
* workflowId
* status
* startedAt
* finishedAt
* provider
* logs
* error

### 9.6 Variant

* id
* runId
* assetId
* score
* isFavorite

### 9.7 ProviderConfig

* id
* provider
* encryptedKey
* endpoint
* modelDefaults

---

## 10. 节点协议设计

第一期不开放复杂插件市场，但要先把协议定稳。

```ts
interface BaseNodeSpec<TInput = unknown, TOutput = unknown> {
  type: string
  version: string
  category: 'asset' | 'text' | 'generator' | 'control' | 'result' | 'export'
  title: string
  inputSchema: unknown
  outputSchema: unknown
  defaultData: Record<string, unknown>
  run?: (ctx: NodeRunContext, input: TInput) => Promise<TOutput>
}
```

### 第一批内置节点

* Asset.ProductImage
* Asset.ReferenceImage
* Asset.BrandImage
* Text.Prompt
* Text.NegativePrompt
* Control.ParamPreset
* Control.BatchVariants
* Generator.ImageGenerate
* Generator.ImageVariation
* Result.Gallery
* Export.ImageBundle

---

## 11. Provider 策略

第一期不做全面 provider 市场，只做 **官方维护的 Provider Adapter**。

### 11.1 第一批建议支持

* OpenAI 图像能力
* 1 家偏图像社区的外部平台
* 1 家国内/第三方图像 API 平台

### 11.2 原则

* 全部走统一 Provider Router
* 所有 provider 都实现统一输入/输出结构
* 用户自带 Key
* 不在社区版做内置额度

### 11.3 统一返回结构

```ts
interface GenerateResult {
  images: Array<{
    url?: string
    localPath?: string
    width?: number
    height?: number
    metadata?: Record<string, unknown>
  }>
  raw?: unknown
}
```

---

## 12. 仓库结构

```text
HongFlow-community/
  apps/
    web/                 # 前端
    api/                 # API 服务
    worker/              # 异步任务执行器
  packages/
    shared/              # types / schemas / constants
    ui/                  # 公共 UI 组件
    nodes/               # 内置节点定义
    providers/           # provider adapters
  infra/
    docker/
    scripts/
  docs/
    getting-started/
    deployment/
    architecture/
    contributing/
    examples/
  examples/
    workflows/
  .github/
    ISSUE_TEMPLATE/
    workflows/
```

---

## 13. API 设计

### 13.1 核心接口

* `POST /projects`
* `GET /projects/:id`
* `POST /boards`
* `GET /boards/:id/workflow`
* `PUT /boards/:id/workflow`
* `POST /assets/upload`
* `POST /runs`
* `GET /runs/:id`
* `GET /runs/:id/results`
* `POST /providers/config`
* `POST /exports`

### 13.2 设计原则

* 先 REST，后续再考虑事件流
* 所有 workflow 存 JSONB
* 运行过程状态由轮询返回
* 第一版不引入复杂实时系统

---

## 14. UX 设计要求

### 14.1 首屏

* 左侧：项目/素材栏
* 中央：画布
* 右侧：属性面板
* 底部：运行状态栏

### 14.2 关键体验

* 拖一张商品图到画布就能开始
* 预置“商品主图生成”模板
* 一次运行能出 4 张变体
* 可直接收藏其中 1 张并导出

### 14.3 设计要求

* 深色主题优先
* 图片卡片尺寸统一
* 结果缩略图必须清晰
* 避免像纯工程工具那样堆参数

---

## 15. 开源与许可证策略

此前方案已明确指出：如果开源主线要求用户可自由自部署，则不应依赖需要生产商业许可的 tldraw；同时社区版的底层必须选择可商业友好、自部署友好的栈。

### 第一期开源建议

* **代码许可证**：Apache 2.0
* **文档许可证**：CC BY 4.0 或等价
* **品牌策略**：单独发布商标使用规范
* **社区规范**：Contributor Covenant

### 为什么不用 tldraw

因为它会直接破坏“社区用户自由自部署”的前提，这与第一期目标冲突。

---

## 16. 部署与运维目标

## 16.1 本地启动目标

用户能通过以下方式完成启动：

```bash
git clone <repo>
cp .env.example .env
docker compose up -d
```

## 16.2 社区版官方支持矩阵

* Docker Compose：支持
* 单机 Linux：支持
* macOS 本地开发：支持
* Windows + Docker Desktop：支持
* K8s：暂不承诺

## 16.3 必备运维能力

* 健康检查
* 数据库迁移
* 日志输出
* 失败任务重试
* 缩略图生成任务隔离
* 导出目录清理策略

---

## 17. 文档计划

第一期文档必须和代码同步发布，不然后面社区起不来。

### 必备文档

1. Getting Started
2. 环境变量说明
3. 本地部署教程
4. 节点体系说明
5. Provider 接入说明
6. Workflow JSON 结构说明
7. 贡献指南
8. Issue 模板与 Roadmap
9. FAQ
10. 示例项目文档

---

## 18. 开发计划

## 18.1 总周期

**建议 6 周**

原先更早的开源 Phase 1 规划强调的是先完成开源 MVP、Docker 一键部署、基础节点与第三方 API 对接。这里我把它收敛到更贴近商品视觉场景的 6 周版本。

### Week 1：需求冻结与基础架构

* 冻结一期范围
* 建 monorepo
* 完成技术脚手架
* 建 Docker Compose
* 建数据库迁移体系
* 定 workflow schema v0.1

**交付物**

* 仓库初始化
* CI 基础
* docs 框架
* schema 初稿

### Week 2：画布与项目系统

* 项目/画布 CRUD
* React Flow 基础画布
* 节点拖拽与连线
* workflow 保存/加载

**交付物**

* 可视化画布 MVP
* workflow JSON 可持久化

### Week 3：素材系统与基础节点

* 素材上传
* 缩略图生成
* 商品图/参考图/品牌图节点
* Prompt 节点
* 参数模板节点

**交付物**

* 素材管理 MVP
* 第一批输入节点

### Week 4：运行系统与 Provider Adapter

* Run 管理
* BullMQ 队列
* Redis 状态管理
* 接入 2 家 provider
* 结果回传

**交付物**

* 首个可运行闭环
* 任务执行日志

### Week 5：结果画廊与导出

* 结果节点
* 多图对比
* 收藏标记
* 导出图片包
* 示例 workflow 1~3

**交付物**

* 用户可完成完整出图流程
* 导出可用

### Week 6：打磨、文档、发布

* 部署文档
* FAQ
* 问题修复
* Release 包
* GitHub 模板
* 示例项目补全

**交付物**

* v0.1.0
* 首个公开可用 release

---

## 19. 人员配置建议

### 最小可行配置

* 前端 1
* 后端 1
* 全栈 / 架构 1
* UI/产品 0.5
* 测试/文档 0.5

### 理想配置

* 前端 2
* 后端 2
* 产品 1
* 设计 1
* QA 1
* 开源运营 0.5

如果你现在团队更小，就必须接受一期功能更少：优先保画布、素材、生成、导出四件事。

---

## 20. 验收标准

第一期发布前必须满足以下验收条件：

### 产品验收

* 用户能新建项目与画布
* 用户能上传至少 3 类素材
* 用户能配置至少 2 家 provider
* 用户能跑通 1 条商品视觉生成链路
* 用户能获得多张结果并进行收藏/导出
* 用户能保存并重新加载 workflow

### 技术验收

* Docker Compose 可启动
* Postgres / Redis / API / Worker 联通
* 失败任务可重试
* workflow schema 有版本号
* 基础日志可查

### 开源验收

* LICENSE
* README
* CONTRIBUTING
* CODE_OF_CONDUCT
* ISSUE_TEMPLATE
* 示例 workflow
* 首个 release tag

---

## 21. 成功指标

### 发布后 30 天观察 6 个数

1. GitHub Star 数
2. 成功部署数 / 反馈数
3. 首次部署成功率
4. 首次成功运行时间中位数
5. 示例 workflow 使用率
6. 社区 PR / Issue 活跃度

### 最低目标

* 100+ GitHub Star
* 20+ 有效 issue / feedback
* 10+ 成功部署反馈
* 3 个以上社区贡献者

---

## 22. 风险与应对

### 风险 1：范围失控

**表现**：一上来想做协作、市场、权限
**应对**：严格执行第一期不做清单

### 风险 2：Provider 差异太大

**表现**：每家接口不一致导致节点逻辑混乱
**应对**：强制走 Provider Router 和统一返回结构

### 风险 3：部署太重

**表现**：用户启动难，社区放弃
**应对**：默认本地文件存储 + Compose 一键起

### 风险 4：画布像工程工具，不像创意工具

**表现**：设计师不愿用
**应对**：优先做图片富节点和结果预览，不堆工程参数

### 风险 5：文档缺失

**表现**：开源仓库看起来有代码，但没人能用
**应对**：文档和 Release 同步上线

---

## 23. 第一版发布清单

**版本号**：v0.1.0-community

### 发布包含

* 可运行的前后端与 worker
* Docker Compose
* 6~10 个基础节点
* 2 家 provider adapter
* 3 个示例项目
* 完整 README
* 部署文档
* Roadmap

### 发布不包含

* 云端账号
* 团队空间
* 模板交易
* 实时协作
* 企业功能

---

## 24. 一句话总结

**第一期社区版不是“做大做全”，而是做出一个可以自由自部署、能稳定跑通商品视觉生产闭环、并且值得社区继续参与的开源底座。**

如果你愿意，我下一步可以直接把这份计划书继续细化成两种可执行文档里的其中一种：
**A. PRD 版**（产品经理/设计/研发一起看的）
或 **B. 技术实施版**（仓库结构、表设计、接口、排期更细）。
