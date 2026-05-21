# 场景示例：搜索 + 对比

**用户输入**：
```
帮我搜一下 RAG 是什么，然后看看我今天学了什么
```

**预期行为**：Supervisor 拆成两个子任务并行执行。

---

## 完整执行 trace

### Step 1：Supervisor 拆解任务

```
Thought: "用户需要两件事：
          ① 联网搜索 RAG 信息（派 search-agent）
          ② 查今天的学习数据（调 study-stats）
          两个任务互相独立，可以并行"
```

### Step 2：分派子任务

```python
# 并行派发
run_skill({
    name: "search-agent",
    arguments: "任务：RAG 检索增强生成 是什么\n数据：（空）\n格式要求：中文优先"
})

run_skill("study-stats")
```

### Step 3：子 Agent 执行

**search-agent** 加载 → 1 tool allowed（web）
```
Web Search → "RAG Retrieval-Augmented Generation 定义 原理 应用场景"
  ↓
[状态] 成功
[数据] 搜到 3 条结果：
  - 标题：从传统RAG到Agentic RAG | 来源：xxx | 摘要：xxx
  - 标题：大模型RAG技术深度解析 | 来源：xxx | 摘要：xxx
```

**study-stats** 加载 → 2 tools allowed（Read, Write）
```
Read notes/2026-05-21.md
  ↓
[日期] 2026-05-21
[时长] 未记录
[完成] 4 项
[完成率] 100%
```

### Step 4：Supervisor 汇总

```
Thought: "两边数据都拿到了。
          RAG 的原理和趋势有了，今天的学习数据也有了。
          直接整合输出"
```

### Step 5：最终输出（节选）

```
一、RAG（检索增强生成）是什么

RAG（Retrieval-Augmented Generation）是一种让大模型在回答前先"查资料"的技术架构。
核心流程：查询 → 向量化 → 检索（向量数据库）→ 拼入提示词 → LLM 生成回答

二、今日学习（2026-05-21）

主题：多 Agent 调度（AI 团队）
完成 4 项：
✅ 第1版：分析单一 Agent 膨胀问题
✅ 第2版：创建 search-agent
✅ 第3版：改造 learning-agent 为 Supervisor
✅ 理解 Supervisor 两种 Action 类型
```

---

## 关键观察

| 环节 | 结果 |
|---|---|
| 任务拆解 | ✅ 正确拆成"搜索"+"数据"两个独立任务 |
| search-agent 调度 | ✅ 加载成功，只用了 web 工具 |
| study-stats 调度 | ✅ 加载成功，去脚本化后无 Python 报错 |
| 状态标记 | ✅ search-agent 返回 `[状态] 成功` |
| 汇总质量 | ✅ 两边信息有机整合，不是简单拼接 |
