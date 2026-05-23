# Skill 索引

按项目分组，共 20 个 skill。

---

## 🎓 学习系统（5 个）

学习主管 + 子 Agent，用于学习数据统计、搜索、复盘、写作。

| Skill | 角色 | 权限 |
|---|---|---|
| `learning-agent` | 学习主管，拆任务派活 | Read + Write |
| `search-agent` | 联网搜索 | web |
| `study-stats` | 学习数据提取 | Read + Write |
| `study-review` | 复盘分析 | Read + Write |
| `writing-agent` | 格式化写作 | Read + Write |

## 🛒 电商客服（5 个 + 1 个 Supervisor）

电商客服主管 + 5 个子 Agent，用于客户意图分析、商品推荐、订单、售后。

| Skill | 角色 | 权限 |
|---|---|---|
| `e-commerce-agent` | 电商客服主管 | Read + Write |
| `intent-agent` | 意图分析 | 无 |
| `recommend-agent` | 商品推荐 | Read |
| `order-agent` | 订单处理 | Read + Write |
| `after-sales-agent` | 售后处理 | Read + Write |

## 💻 开发团队（9 个 + 1 个 Supervisor）

开发主管 + 9 个子 Agent，覆盖整条开发流水线。

| Skill | 角色 | 权限 |
|---|---|---|
| `dev-supervisor` | 开发主管 | Read + Write |
| `product-manager` | 产品经理，出 PRD | Read |
| `architect` | 架构师，出技术方案 | Read + Write |
| `frontend-dev` | 前端开发 | Read + Write |
| `backend-dev` | 后端开发 | Read + Write |
| `integrator` | 前后端集成，API 对接 | Read + Write |
| `code-reviewer` | 代码审查 | Read |
| `tester` | 测试 | Read |
| `security-reviewer` | 安全审查 | Read |
| `devops` | 部署方案 | Read |
| `documenter` | 文档 | Read + Write |

---

## 总计

- 学习系统：5 个
- 电商客服：6 个
- 开发团队：11 个（含 Supervisor 和其他技能）
