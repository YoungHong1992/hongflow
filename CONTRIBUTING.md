# Contributing

## 开发前提

- Node.js 22+
- pnpm 10+
- Docker / Docker Compose

## 本地开发流程

```bash
cp .env.example .env
pnpm install
pnpm dev
```

如需数据库迁移：

```bash
pnpm db:migrate
```

## 提交约束

- 保持 TypeScript 严格模式通过
- 新增接口时同步更新 `packages/shared`
- 涉及 workflow 结构时升级 schema version
- 新增 provider 时补充 `packages/providers` 和文档

## Pull Request 要求

- 描述变更背景与范围
- 给出验证方式
- 涉及 UI 的改动附截图
- 涉及数据结构的改动说明兼容策略
