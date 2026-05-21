# 场景示例：周报生成

**用户输入**：
```
把这周的学习数据整理成周报
```

**预期行为**：Supervisor 调 study-stats 获取本周各天的数据，然后派 writing-agent 生成周报。

---

## 完整执行 trace

### Step 1：Supervisor 拆解任务

```
Thought: "需要两步：
          ① 获取本周 5 天的学习数据（调 study-stats，每天一次）
          ② 派 writing-agent 把数据格式化为周报"
```

### Step 2：获取数据

```python
# 调 study-stats 获取每一天的数据
stats_mon = run_skill("study-stats", arguments="2026-05-18")
stats_tue = run_skill("study-stats", arguments="2026-05-19")
stats_wed = run_skill("study-stats", arguments="2026-05-20")
stats_thu = run_skill("study-stats", arguments="2026-05-21")
stats_fri = run_skill("study-stats", arguments="2026-05-22")
```

**study-stats 返回（以 05-18 为例）**：
```
[日期] 2026-05-18
[时长] 2.0 小时
[完成] 3 项
[未完成] 0 项
[完成率] 100%
已完成：
  ✓ 了解 Prompt 基础结构
  ✓ 掌握 Few-shot 技巧
  ✓ 理解 Chain-of-thought
```

将所有 5 天的数据汇总后：

```
总数据：
  学习天数：5 天
  总时长：12.5 小时
  总完成：17 项
  总未完成：1 项
  平均完成率：94%
```

### Step 3：派 writing-agent 生成周报

```python
run_skill({
    name: "writing-agent",
    arguments: "任务：周报\n数据：本周 5 天数据汇总...（详细数据）\n格式要求：中文优先"
})
```

**writing-agent 处理**：
```
Thought: "用户要周报格式。数据覆盖了 5 天。
          按周报模板组织：概览 + 逐日明细 + 本周重点"
```

**writing-agent 出参**：
```
[状态] 成功
[数据]
```

### Step 4：最终输出

```
# 学习周报：第 21 周

## 概览
- 📅 日期范围：2026-05-18 ~ 2026-05-22
- ⏱ 总时长：12.5 小时
- ✅ 完成：17 项 / ❌ 未完成：1 项
- 📊 完成率：94%

## 逐日明细
| 日期 | 时长 | 完成 | 主题 |
|---|---|---|---|
| 05-18 | 2h | 3 项 | Prompt 技巧 |
| 05-19 | 3h | 4 项 | ReAct 循环 |
| 05-20 | 2.5h | 4 项 | Tool-use Agent |
| 05-21 | 2.5h | 4 项 | 多 Agent 调度 |
| 05-22 | 2.5h | 2 项 | 四方向收尾 |

## 本周重点
- 核心突破：从 Pipeline 进阶到多 Agent 调度 + 通信协议 + 记忆系统
- 关键实践：全链路跑通，去脚本化完成
```

---

## 关键观察

| 环节 | 结果 |
|---|---|
| 多天数据获取 | ✅ study-stats 可重复调用，每次不同日期 |
| writing-agent 调度 | ✅ 入参带"任务：周报"，自动选模板 |
| 状态标记 | ✅ writing-agent 返回 `[状态] 成功` |
| 输出格式 | ✅ 标准周报：概览表 + 逐日明细 + 重点总结 |

## 偏好记忆的应用

如果用户之前说过"周报不需要未完成事项"：

```
Supervisor 启动时读取 preferences.md：
  内容偏好 → 周报格式：不包含未完成事项

Thought: "用户偏好里写明了周报不要未完成事项，
          给 writing-agent 的格式要求里加上"
```

writing-agent 的输出就会自动省略 ❌ 未完成一行。
