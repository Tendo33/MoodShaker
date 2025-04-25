# API 文档

## 概述

本文档描述了Moodshaker应用程序的API接口。API使用RESTful风格设计，支持JSON格式的请求和响应。

## 基础URL

\`\`\`
${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1
\`\`\`

## 认证

大多数API端点需要认证。认证通过Bearer令牌实现：

\`\`\`
Authorization: Bearer <token>
\`\`\`

## 错误处理

API使用标准HTTP状态码表示请求状态：

- 200: 成功
- 400: 请求错误
- 401: 未授权
- 403: 禁止访问
- 404: 资源不存在
- 500: 服务器错误

错误响应格式：

\`\`\`json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述"
  }
}
\`\`\`

## 端点

### 鸡尾酒推荐

#### 请求推荐

\`\`\`
POST /agents/{agent_type}
\`\`\`

参数:
- `agent_type`: 调酒师类型，可选值为 `classic_bartender` 或 `creative_bartender`

请求体:
\`\`\`json
{
  "message": "用户反馈",
  "model": "deepseek-v3-250324",
  "alcohol_level": "medium",
  "has_tools": true,
  "difficulty_level": "medium",
  "base_spirits": ["gin", "vodka"],
  "user_id": "1",
  "session_id": "session-123"
}
\`\`\`

响应:
\`\`\`json
{
  "id": "cocktail-123",
  "name": "鸡尾酒名称",
  "english_name": "Cocktail Name",
  "description": "鸡尾酒描述",
  "match_reason": "推荐理由",
  "base_spirit": "基酒",
  "alcohol_level": "酒精度",
  "serving_glass": "酒杯类型",
  "time_required": "制作时间",
  "flavor_profiles": ["甜", "酸"],
  "ingredients": [
    {
      "name": "材料名称",
      "amount": "30",
      "unit": "ml"
    }
  ],
  "tools": [
    {
      "name": "工具名称",
      "alternative": "替代工具"
    }
  ],
  "steps": [
    {
      "step_number": 1,
      "description": "步骤描述",
      "tips": "提示"
    }
  ]
}
\`\`\`

#### 获取鸡尾酒图片

\`\`\`
GET /agents/cocktail_image
\`\`\`

查询参数:
- `user_id`: 用户ID
- `session_id`: 会话ID

响应:
\`\`\`json
{
  "image_data": "base64编码的图片数据"
}
\`\`\`

### 用户管理

#### 用户登录

\`\`\`
POST /auth/login
\`\`\`

请求体:
\`\`\`json
{
  "username": "用户名",
  "password": "密码"
}
\`\`\`

响应:
\`\`\`json
{
  "token": "JWT令牌",
  "data": {
    "id": 1,
    "username": "用户名",
    "email": "邮箱",
    "role": "user"
  }
}
\`\`\`

#### 用户注册

\`\`\`
POST /register
\`\`\`

请求体:
\`\`\`json
{
  "username": "用户名",
  "password": "密码",
  "email": "邮箱",
  "phone": "手机号"
}
\`\`\`

响应:
\`\`\`json
{
  "message": "注册成功",
  "data": {
    "id": 1,
    "username": "用户名",
    "email": "邮箱"
  }
}
\`\`\`

#### 重置密码

\`\`\`
POST /password/reset
\`\`\`

请求体:
\`\`\`json
{
  "old_password": "旧密码",
  "new_password": "新密码"
}
\`\`\`

响应:
\`\`\`json
{
  "message": "密码重置成功"
}
