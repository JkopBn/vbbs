# Vercel 校园评选 (Next.js)

这是一个简单的 Next.js 应用，用于校园「校花/校草」评选：
- 无初始候选人，用户可提交候选人（姓名、简介、图片 URL）
- 用户可为候选人投票
- 客户端使用 localStorage 做基本的防刷（非严格）
- 后端示例使用 `lowdb` 将数据写入 `data/db.json`（**注意**：在 Vercel Serverless 环境下，写入文件可能不会长期持久化；部署到 Vercel 后数据可能随部署或冷启动丢失）

## 推荐改进（生产环境）
- 将数据存储迁移到外部数据库（例如 Postgres / Supabase / Firebase），以保证持久化与并发安全
- 增加认证（例如学校邮箱验证）与投票限制（每学号/每邮箱一票）
- 添加图片上传（使用第三方 object storage）
- 添加管理面板（审核候选人、导出结果）

## 本地运行
1. 安装依赖：`npm install`
2. 开发：`npm run dev`
3. 打包：`npm run build`，在 Vercel 添加项目并部署，或直接 `vercel` 部署。

## 文件说明
- `pages/index.js`：前端页面
- `pages/api/candidates.js`：候选人增/查
- `pages/api/vote.js`：投票接口
- `data/db.json`：运行时产生（如果服务器允许写入）

## 部署到 Vercel
- 该项目兼容 Vercel。注意 Vercel 的 Serverless 文件系统不保证持久化数据，强烈建议在生产使用外部 DB。

