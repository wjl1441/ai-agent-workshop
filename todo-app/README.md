# 待办事项管理系统

简单的待办事项管理页面，支持增删改查，前后端分离架构。

## 技术栈

| 层 | 技术 |
|------|------|
| 前端 | HTML + CSS + Vanilla JS |
| 后端 | Node.js + Express |
| 存储 | JSON 文件 |

## 快速开始

```bash
# 1. 进入后端目录
cd backend

# 2. 安装依赖
npm install

# 3. 启动服务
npm start
```

访问 **http://localhost:3000**

## 目录结构

```
todo-app/
├── frontend/
│   ├── index.html          # 主页面
│   ├── css/style.css       # 样式
│   └── js/
│       ├── api.js           # API 请求封装
│       └── app.js           # 页面逻辑
├── backend/
│   ├── server.js            # 服务入口（含静态文件托管）
│   ├── routes/todos.js      # API 路由
│   ├── data/todos.json      # 数据存储
│   └── package.json
└── README.md
```

## 功能

- 添加待办事项
- 查看待办列表
- 编辑待办标题（原地编辑）
- 删除待办（确认弹窗）
- 勾选切换完成状态
- 筛选：全部 / 未完成 / 已完成

## API 文档

### 获取待办列表

```
GET /api/todos?status=all|active|completed
```

响应：
```json
[
  {
    "id": "mphwkckw1p8vre",
    "title": "买菜",
    "completed": false,
    "created_at": "2026-05-23T05:23:10.641Z"
  }
]
```

### 添加待办

```
POST /api/todos
Content-Type: application/json

{ "title": "买菜" }
```

响应：`201 Created`

### 更新待办

```
PUT /api/todos/:id
Content-Type: application/json

{ "title": "新标题" }
```

或

```
{ "completed": true }
```

### 删除待办

```
DELETE /api/todos/:id
```

响应：`{ "success": true }`

### 错误响应

| 状态码 | 说明 |
|--------|------|
| 400 | 标题不能为空 |
| 404 | 待办不存在 |
