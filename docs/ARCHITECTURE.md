# 架构详解

## 整体架构

```
┌─────────────────────────────────────────────────────────┐
│                       用户                               │
│           "搜一下 RAG，再看看今天学了什么"               │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   learning-agent                        │
│                  (Supervisor 主管)                      │
│                                                         │
│  ① Thought: "拆成两步 — 搜索派 search-agent，           │
│              查数据调 study-stats"                      │
│  ② Action:  dispatch sub-agents                        │
│  ③ Observation: collect results                        │
│  ④ Answer:  synthesis                                   │
│                                                         │
│  📁 references/preferences.md ← 记忆系统                │
└──────┬──────────────────┬──────────────────┬────────────┘
       │                  │                  │
       ▼                  ▼                  ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│ search-agent│   │ study-stats │   │study-review │
│ (子 Agent)  │   │  (工具)     │   │  (工具)     │
│             │   │             │   │             │
│ 权限: web   │   │ 权限: Read  │   │ 权限: Read  │
│             │   │       Write │   │       Write │
│ 联网搜索    │   │ 笔记数据提取│   │ 复盘生成    │
└─────────────┘   └─────────────┘   └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │writing-agent│
                    │ (子 Agent)  │
                    │             │
                    │ 权限: Read  │
                    │       Write │
                    │ 格式化写作  │
                    └─────────────┘
```

## 两种 Action

Supervisor 的 Action 有两种类型：

### 类型 A：调工具（简单任务）

```python
# 任务简单，Supervisor 自己调工具就够
run_skill("study-stats")           # 读笔记统计
run_skill("study-review")          # 生成复盘
```

用于：查数据、简单分析、单步操作

### 类型 B：调子 Agent（复杂任务）

```python
# 任务专业，派给专门的子 Agent
run_skill({
    name: "search-agent",
    arguments: "任务：搜索 RAG 最新进展\n数据：（空）\n格式要求：中文优先"
})
```

用于：搜索、写作、需要特殊权限的任务

### 类型 C：混合（同时需要）

```python
# 先派子 Agent，再自己调工具
step1 = run_skill({name: "search-agent", arguments: "任务：..."})   # 派出去
step2 = run_skill("study-stats")                                      # 自己调
synthesis(step1, step2)                                               # 汇总
```

## 决策流程

```
用户输入
    │
    ▼
读取偏好 (preferences.md)
    │
    ▼
Thought: 拆解任务
    ├── 简单任务 → Action: 调工具 → Observation → Answer
    │
    ├── 复杂任务 → Action: 派子 Agent → Observation → Answer
    │
    └── 混合任务 → Action: 派子 Agent + 调工具 → 汇总 → Answer
    │
    ▼
    发现重复偏好？ → 写入 preferences.md
```

## 关键原则

1. **不预设路径** — 同一轮可以交替使用工具和子 Agent，顺序由 Thought 决定
2. **权限隔离** — 子 Agent 只有完成自身任务的最小权限
3. **状态可读** — 所有子 Agent 返回结果带 `[状态]` 标记
4. **静默恢复** — 子 Agent 失败时，Supervisor 尝试替代方案或告知用户
