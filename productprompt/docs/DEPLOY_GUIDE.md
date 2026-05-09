# ProductPrompt.ai 部署指南

## 部署方式一：GitHub Pages（推荐，免费）

### 步骤1：创建GitHub仓库

1. 访问 https://github.com/new
2. 仓库名称：`productprompt-ai`
3. 选择 **Public**（公开）
4. 不要勾选 "Initialize this repository with a README"
5. 点击 **Create repository**

### 步骤2：推送代码到GitHub

```bash
# 添加远程仓库（替换 YOUR_USERNAME 为你的GitHub用户名）
git remote add origin https://github.com/YOUR_USERNAME/productprompt-ai.git

# 推送代码
git branch -M main
git push -u origin main
```

### 步骤3：启用GitHub Pages

1. 进入仓库的 **Settings** 页面
2. 左侧菜单点击 **Pages**
3. **Build and deployment** → **Source** 选择 **GitHub Actions**
4. 保存

### 步骤4：等待自动部署

- GitHub Actions会自动运行部署流程
- 访问 **Actions** 标签页查看部署状态
- 部署完成后，访问 `https://YOUR_USERNAME.github.io/productprompt-ai/`

---

## 部署方式二：Vercel（推荐，自动CDN）

### 步骤1：推送代码到GitHub

同上，先完成方式一的步骤1-2。

### 步骤2：连接Vercel

1. 访问 https://vercel.com/new
2. 点击 **Import Git Repository**
3. 选择你的 `productprompt-ai` 仓库
4. **Framework Preset** 选择 **Next.js**
5. 点击 **Deploy**

### 步骤3：配置自定义域名（可选）

1. 进入Vercel项目 **Settings** → **Domains**
2. 添加你的域名（如 `productprompt.ai`）
3. 按照Vercel的DNS配置指引操作

---

## 部署方式三：手动上传到静态托管

如果你已经有静态托管服务（如Netlify、Cloudflare Pages）：

```bash
# 构建项目
cd /root/productprompt-ai
npm run build

# dist/ 目录就是完整的静态网站
# 将 dist/ 目录下的所有文件上传到你的托管服务
```

---

## 部署后检查清单

- [ ] 网站能正常访问
- [ ] 输入产品名能生成Prompt
- [ ] 复制按钮能正常工作
- [ ] 响应式布局在手机端正常
- [ ] SEO meta标签正确（查看页面源代码）
- [ ] 网站速度 < 3秒（用PageSpeed Insights测试）

---

## 域名配置建议

| 域名 | 价格 | 购买渠道 |
|------|------|---------|
| productprompt.ai | ~$10/年 | Namecheap / Cloudflare |
| productprompt.co | ~$8/年 | Namecheap |
| aiprompts.store | ~$5/年 | Namecheap |

---

## 下一步操作

1. **立即**：按方式一部署到GitHub Pages（5分钟）
2. **今天**：购买域名并配置到Vercel
3. **本周**：提交到Google Search Console
4. **下周**：挂载Google AdSense

---

> 有问题随时问我！
