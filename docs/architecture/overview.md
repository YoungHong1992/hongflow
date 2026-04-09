# Architecture Overview

```text
Web (React + React Flow)
  -> API (Fastify)
     -> PostgreSQL
     -> Redis / BullMQ
     -> Local File Storage
  -> Worker
     -> Provider Router
     -> Result Assets / Variants
```

当前实现重点是把一期的基础边界固定下来，而不是一次性做完所有产品能力。
