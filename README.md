# 🤖 AI Agent 学习工作台

> 一套由 Supervisor 统一调度的多 Agent 架构，支持联网搜索、学习统计、复盘分析和格式化写作。

![架构](https://img.shields.io/badge/架构-Supervisor_→_Sub--Agent-blue)
![状态](https://img.shields.io/badge/状态-实战验证-success)
![协议](https://img.shields.io/badge/协议-标准化通信-orange)

---

## 架构总览

```
用户提问
    │
    ▼
┌──────────────────────────────────┐
│         learning-agent           │
│      (Supervisor 主管)           │
│  拆任务 · 派活 · 汇总 · 记忆     │
└────┬───────┬───────┬──────┬─────┘
     │       │       │      │
     ▼       ▼       ▼      ▼
 ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
 │stats │ │review│ │search│ │writing│
 │数据  │ │复盘  │ │联网  │ │写作  │
 │提取  │ │分析  │ │搜索  │ │排版  │
 └──────┘ └──────┘ └──────┘ └──────┘
```

**核心思想**：每个 Agent 只做一件事，Supervisor 负责拆解问题和调度。

---

## 技能树

| 技能 | 职责 | 工具权限 |
|---|---|---|
| `learning-agent` | 主管：拆解任务、派发、汇总、记忆 | Read + Write |
| `search-agent` | 联网搜索并返回结构化结果 | web 仅此一个 |
| `study-stats` | 从笔记中提取学习统计数据 | Read + Write |
| `study-review` | 生成结构化复盘报告 | Read + Write |
| `writing-agent` | 格式化写作（周报/笔记/对比报告） | Read + Write |
| `e-commerce-agent` | 电商客服（独立项目） | — |
| `dev-supervisor` | 开发团队（独立项目） | — |

---

## 关键特性

### 🧠 多 Agent 调度

Supervisor 不直接干活，而是：
1. **拆任务** — 分析用户一句话里包含几个子需求
2. **分派** — 简单任务自己调工具，复杂任务派给子 Agent
3. **汇总** — 整合各子 Agent 返回的结果

### 📡 统一通信协议

所有子 Agent 使用同一套入参出参格式：

```
入参（Supervisor → 子 Agent）：
  任务：<做什么>
  数据：<原始数据>
  格式要求：<可选>

出参（子 Agent → Supervisor）：
  [状态] 成功 / 无结果 / 错误
  [数据] <具体内容>
```

`[状态]` 标记让 Supervisor 能精确判断结果——搜不到就是 `[状态] 无结果`，不会静默失败。

### 💾 记忆系统

Supervisor 维护 `preferences.md`，记住用户的持久偏好（搜索语言、输出风格等），下次自动沿用。

---

## 实战验证

以下流程已实际跑通：

```
用户 → "帮我搜一下 RAG 是什么，然后看看我今天学了什么"

Supervisor 拆解：① 搜索（派 search-agent）② 查数据（调 study-stats）
  → [状态] 成功
  → 整合输出：RAG 技术解读 + 今日学习回顾
```

详细 trace 见 [`examples/`](examples/)。

---

## 项目结构

```
├── README.md
├── docs/
│   ├── ARCHITECTURE.md               ← 架构详解
│   ├── SKILLS.md                     ← 各技能说明
│   └── COMMUNICATION_PROTOCOL.md     ← 通信协议标准
├── examples/
│   ├── scenario-search-compare.md    ← 搜索+对比示例
│   └── scenario-weekly-report.md     ← 周报生成示例
├── .claude/skills/
│   ├── learning-agent/
│   │   ├── SKILL.md
│   │   └── references/
│   │       └── preferences.md
│   ├── search-agent/
│   │   └── SKILL.md
│   ├── study-stats/
│   │   └── SKILL.md
│   ├── study-review/
│   │   ├── SKILL.md
│   │   └── references/
│   │       └── review-template.md
│   └── writing-agent/
│       └── SKILL.md

```

---

## 快速开始

本项目基于 Claude Code 的 Skills 系统运行。

```bash
# 在 Claude Code 中直接对话，Supervisor 会自动匹配
/learning-agent 帮我查一下今天学了什么

# 或手动指定
/learning-agent 帮我搜一下 xxx，然后对比这周的学习
```

每个 skill 的 `description` 字段决定了自动触发条件，也支持通过 `/skill <name>` 手动调用。

---

## 项目演进

本项目从单一 Prompt 封装逐步演进为完整的多 Agent 架构：

```
Prompt 封装 → 多层 Skill → Pipeline 编排 → ReAct 循环 → 多 Agent 调度 → 通信协议 + 记忆系统
```

每个阶段的设计决策记录在 `docs/` 中。

---

## 设计原则

1. **单一职责** — 每个子 Agent 只做一件事
2. **最小权限** — 只给 Agent 刚好够用的工具
3. **显式协议** — 入参出参标准化，不靠猜测
4. **记忆优先** — 用户偏好持久化，减少重复沟通
5. **去脚本化** — 优先用 AI 自身能力，少依赖外部脚本

---

## 许可证

MIT
