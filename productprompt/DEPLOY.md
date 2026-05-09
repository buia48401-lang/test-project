# 🚀 ProductPrompt.ai 部署指南

## 方案一：GitHub Pages（推荐 - 免费）

### 步骤 1：启用 GitHub Pages
1. 打开 https://github.com/buia48401-lang/test-project/settings/pages
2. 在 **"Source"** 下拉菜单选择 **"GitHub Actions"**
3. 点击 **Save**

### 步骤 2：触发部署
1. 进入 https://github.com/buia48401-lang/test-project/actions
2. 点击左侧的 **"Deploy to GitHub Pages"** 工作流
3. 点击 **"Run workflow"** → 选择 main 分支 → 点击 **"Run workflow"**

### 步骤 3：等待部署完成
- 工作流会执行：Install → Build → Upload → Deploy
- 约 2-3 分钟后完成
- 部署地址：https://buia48401-lang.github.io/test-project/

### 步骤 4：配置自定义域名（可选）
1. 打开 https://github.com/buia48401-lang/test-project/settings/pages
2. 在 **"Custom domain"** 输入你的域名，如 `productprompt.ai`
3. 点击 **Save**
4. 在你的域名 DNS 添加 CNAME 记录：
   ```
   Type: CNAME
   Name: @
   Target: buia48401-lang.github.io
   ```
5. 等待 DNS 生效（最多 24 小时）

---

## 方案二：Vercel（推荐 - 自动部署 + 全球CDN）

### 步骤 1：注册 Vercel
1. 访问 https://vercel.com/signup
2. 选择 **"Continue with GitHub"**
3. 授权 Vercel 访问你的 GitHub 仓库

### 步骤 2：导入项目
1. 访问 https://vercel.com/new
2. 选择 **"Import Git Repository"**
3. 找到并选择 `buia48401-lang/test-project`
4. 点击 **Import**

### 步骤 3：配置项目
1. **Framework Preset**：选择 `Next.js`
2. **Root Directory**：保持默认（`./`）
3. **Build Command**：保持默认（`next build`）
4. **Output Directory**：改为 `dist`（因为 next.config.ts 中设置了 `distDir: 'dist'`）
5. 点击 **Deploy**

### 步骤 4：配置自定义域名
1. 项目部署完成后，进入项目 Dashboard
2. 点击 **"Domains"**
3. 输入你的域名（如 `productprompt.ai`）
4. 点击 **Add**
5. 按提示配置 DNS 记录

### Vercel 优势
- ✅ 自动部署（每次 push 到 main 自动部署）
- ✅ 全球 CDN（自动边缘缓存）
- ✅ HTTPS 自动配置
- ✅ 预览部署（PR 自动预览链接）
- ✅ 性能分析内置

---

## 方案三：Cloudflare Pages（推荐 - 免费 + 全球CDN）

### 步骤 1：注册 Cloudflare
1. 访问 https://dash.cloudflare.com/sign-up
2. 注册账号

### 步骤 2：创建 Pages 项目
1. 进入 Cloudflare Dashboard
2. 左侧菜单点击 **"Pages"**
3. 点击 **"Create a project"**
4. 选择 **"Connect to Git"**
5. 授权 Cloudflare 访问 GitHub
6. 选择 `buia48401-lang/test-project`

### 步骤 3：配置构建设置
1. **Framework preset**：选择 `Next.js (Static HTML Export)`
2. **Build command**：`npm run build`
3. **Build output directory**：`dist`
4. 点击 **Save and Deploy**

### Cloudflare 优势
- ✅ 完全免费（无流量限制）
- ✅ Cloudflare 全球 CDN
- ✅ 自动 HTTPS
- ✅ 边缘函数支持
- ✅ 与 Cloudflare 生态集成

---

## 方案四：Netlify（经典选择）

### 步骤 1：注册 Netlify
1. 访问 https://app.netlify.com/signup
2. 选择 GitHub 登录

### 步骤 2：导入项目
1. 点击 **"Add new site"** → **"Import an existing project"**
2. 选择 GitHub
3. 找到 `buia48401-lang/test-project`

### 步骤 3：配置构建设置
1. **Build command**：`npm run build`
2. **Publish directory**：`dist`
3. 点击 **Deploy site**

---

## 🔧 部署后验证清单

### 基础功能验证
- [ ] 网站能正常访问（无 404）
- [ ] 输入产品名能生成 Prompt
- [ ] 复制功能正常工作
- [ ] 历史记录能保存和显示
- [ ] 收藏功能正常工作
- [ ] 批量生成功能正常
- [ ] 导出 CSV/TXT 功能正常

### SEO 验证
- [ ] 查看网页源代码包含 `<meta property="og:title">`
- [ ] 查看网页源代码包含 Schema.org JSON-LD
- [ ] 访问 `/robots.txt` 正常显示
- [ ] 访问 `/sitemap.xml` 正常显示
- [ ] 浏览器标签显示正确 favicon

### 性能验证
- [ ] 首屏加载时间 < 3 秒
- [ ] Lighthouse Performance 分数 > 80
- [ ] 移动端显示正常

---

## 📊 部署状态查询

| 平台 | 部署状态页面 |
|------|-------------|
| GitHub Pages | https://github.com/buia48401-lang/test-project/actions |
| Vercel | https://vercel.com/dashboard |
| Cloudflare | https://dash.cloudflare.com |
| Netlify | https://app.netlify.com |

---

## 🆘 常见问题

### Q: 部署后页面显示 404？
**A**: 检查构建输出目录是否正确。Next.js 静态导出输出到 `dist/` 目录，确保部署平台配置的是 `dist` 而非 `.next`。

### Q: 样式丢失/页面空白？
**A**: 检查 `next.config.ts` 中的 `assetPrefix` 设置。GitHub Pages 子路径部署需要设置为 `'./'`，根域名部署可设为 `undefined`。

### Q: 如何回滚？
**A**: 
- **GitHub Pages**: 在 Actions 页面找到历史部署，点击 "Re-run jobs"
- **Vercel**: Dashboard → Deployments → 选择旧版本 → "Promote to Production"
- **Cloudflare**: Dashboard → Deployments → 选择旧版本 → "Rollback"

### Q: 自定义域名不生效？
**A**: 
1. 确认 DNS CNAME 记录已添加
2. 等待 DNS 传播（最多 24 小时）
3. 检查域名是否已备案（中国大陆服务器需要）
4. 确认 SSL 证书已自动配置

---

## 🎯 推荐选择

| 场景 | 推荐平台 | 理由 |
|------|---------|------|
| 最快上手 | **Vercel** | Next.js 原生支持，自动配置 |
| 完全免费 | **Cloudflare Pages** | 无流量限制，全球 CDN |
| 简单静态 | **GitHub Pages** | 无需额外账号，GitHub 集成 |
| 企业级 | **Vercel Pro** | 团队协作，分析工具，支持 |

---

## 📞 部署完成后

部署成功后，访问你的域名，确认一切正常。然后可以：

1. **注册 Google Search Console** - https://search.google.com/search-console
2. **提交 sitemap** - 添加 `https://你的域名/sitemap.xml`
3. **请求索引** - 让 Google 收录你的网站
4. **设置 Google Analytics** - 追踪访问数据

祝部署顺利！🚀
