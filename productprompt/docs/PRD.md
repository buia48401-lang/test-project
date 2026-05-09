# ProductPrompt.ai 产品设计文档 (PRD)

> **版本**: v1.0  
> **日期**: 2026-05-05  
> **作者**: 陈凡AI编程  
> **状态**: MVP已完成，本文档指导后续三期迭代  

---

## 一、产品概述

### 1.1 一句话定位
**让电商卖家输入产品名，一键生成专业产品图Prompt** — 解决卖家"想用AI生成产品图但不懂写Prompt"的痛点。

### 1.2 核心价值主张
| 用户痛点 | 我们的解决方案 |
|---------|-------------|
| 不懂Prompt Engineering | 输入产品名 → AI自动生成专业Prompt |
| 用Midjourney/Flux效果不稳定 | Prompt结构经过电商场景优化 |
| 想要控制生成效果 | Prompt完全可见、可编辑、可复制 |
| 不同平台要求不同 | 内置Amazon/Shopify/Etsy/Temu/eBay适配 |
| 现有工具太贵($20+/月) | 免费5次/天 + Pro仅$9.9/月 |

### 1.3 目标用户画像

**主要用户**: Amazon / Temu / Shopify / Etsy / eBay 中小卖家
- **年龄**: 25-45岁
- **技术能力**: 会用电脑，但不会写Prompt
- **日均需求**: 3-10张产品图
- **付费意愿**: 能省时间/提升销量的工具愿意付$10-50/月
- **常用工具**: Midjourney, Flux, DALL-E, Canva

**次要用户**: 
- 自媒体/博客作者（需要文章配图Prompt）
- 设计师（需要快速出概念图Prompt）

---

## 二、竞品分析

### 2.1 直接竞品

#### 竞品A: Mokker.ai
| 维度 | 详情 |
|------|------|
| **URL** | https://www.mokker.ai |
| **类型** | AI产品图背景替换工具 |
| **核心功能** | 上传产品图 → AI去背景 → 选择场景模板 → 生成产品图 |
| **定价** | Freemium + $20-50/月 |
| **流量** | ~500K/月 (Similarweb) |
| **优势** | ① 100+场景模板 ② 批量生成 ③ 高清输出 ④ 操作简单 |
| **弱点** | ① **Prompt不可见（黑盒）** ② 模板固定不够灵活 ③ 无AI优化建议 ④ 贵 |
| **我们的差异化** | 我们让用户看到并编辑Prompt，掌控生成效果 |

#### 竞品B: Pixa (原Pixelcut)
| 维度 | 详情 |
|------|------|
| **URL** | https://www.pixa.com |
| **类型** | 全能创意平台 |
| **核心功能** | 产品展示图 + AI UGC视频 + 人物一致性 + 背景移除/扩展 |
| **定价** | Subscription + Credits |
| **流量** | 70M+ users |
| **优势** | ① 功能全面 ② 大品牌背书(Adidas/Apple/Nike等) ③ 视频+图片 |
| **弱点** | ① **大而全，无垂直深度** ② **Prompt不可见** ③ 贵 ④ 学习曲线陡峭 |
| **我们的差异化** | 我们只做Prompt，更简单、更便宜、更垂直 |

#### 竞品C: Phot.AI
| 维度 | 详情 |
|------|------|
| **URL** | https://www.phot.ai |
| **类型** | 企业创意增长平台 |
| **核心功能** | AngleLab(广告角度) + ListingLab(电商优化) + VideoLab(视频创意) |
| **定价** | Enterprise SaaS ($$$) |
| **目标用户** | 大品牌/广告商 |
| **优势** | ① 数据驱动创意 ② 分析竞品广告 ③ 多平台适配 |
| **弱点** | ① **只面向大企业** ② **极其昂贵** ③ **无小卖家工具** ④ Prompt不可见 |
| **我们的差异化** | 我们面向中小卖家，$9.9/月起步 |

### 2.2 间接竞品

#### 竞品D: PromptHero / PromptBase
| 维度 | 详情 |
|------|------|
| **URL** | https://prompthero.com / https://promptbase.com |
| **类型** | Prompt模板市场 |
| **核心功能** | 浏览/购买Prompt模板 |
| **定价** | 免费 / 单条购买$1.99-9.99 |
| **优势** | ① 大量模板 ② 社区驱动 ③ 分类丰富 |
| **弱点** | ① **通用Prompt，不垂直** ② **无生成逻辑** ③ 需要用户自己筛选 ④ 无优化建议 |
| **我们的差异化** | 我们自动生成，无需筛选；垂直电商，更专业 |

### 2.3 竞品功能对比矩阵

| 功能 | Mokker.ai | Pixa | Phot.AI | PromptHero | **ProductPrompt.ai** |
|------|-----------|------|---------|------------|---------------------|
| 产品图生成 | ✅ | ✅ | ✅ | ❌ | ❌（我们做Prompt） |
| **Prompt生成** | ❌ | ❌ | ❌ | ❌ | **✅ 核心功能** |
| **Prompt可见/可编辑** | ❌ | ❌ | ❌ | ✅ | **✅** |
| 多平台适配 | ✅ | ✅ | ✅ | ❌ | **✅** |
| 电商垂直优化 | ✅ | ⚠️ | ✅ | ❌ | **✅** |
| 批量生成 | ✅ | ✅ | ✅ | ❌ | **Pro版✅** |
| 价格友好 | ❌ | ❌ | ❌ | ✅ | **✅ $9.9/月** |
| 使用门槛 | 低 | 高 | 极高 | 中 | **✅ 极低** |

---

## 三、三期产品规划

---

## 🔥 第一期：MVP验证期（已完成，可立即迭代）

> **目标**: 验证"用户是否需要Prompt生成工具"这个假设  
> **周期**: 2周（开发1周 + 数据观察1周）  
> **对标网站**: Mokker.ai（首页输入体验）+ PromptHero（Prompt展示方式）  

### 3.1 第一期功能清单

#### 核心功能（必须实现）

| 功能ID | 功能名称 | 功能描述 | 优先级 | 对标参考 |
|--------|---------|---------|--------|---------|
| P1-F01 | 产品名称输入 | 单行文本输入框，支持回车触发生成 | P0 | Mokker.ai首页输入框 |
| P1-F02 | 平台选择 | 下拉选择：Amazon/Shopify/Etsy/Temu/eBay/通用 | P0 | Mokker.ai的平台适配逻辑 |
| P1-F03 | 产品类型选择 | 下拉选择：3C电子/服装/珠宝/食品/家具/美妆/通用 | P0 | Phot.AI的品类分类 |
| P1-F04 | **Prompt自动生成** | 基于产品名+平台+类型，生成3种风格Prompt | **P0** | **PromptHero的Prompt结构 + Mokker的场景逻辑** |
| P1-F05 | **Prompt展示卡片** | 3张卡片展示：白底图/场景图/细节图 | **P0** | **PromptHero的卡片布局** |
| P1-F06 | **一键复制** | 点击复制Prompt到剪贴板，带成功反馈 | **P0** | **PromptHero的复制按钮** |
| P1-F07 | 示例产品快捷输入 | 点击预设产品名快速填充 | P1 | Mokker.ai的示例产品 |
| P1-F08 | 响应式布局 | 桌面/平板/手机自适应 | P0 | 参考Vercel官网的响应式 |

#### Prompt生成逻辑（第一期）

**生成3种风格的Prompt：**

1. **White Background（白底产品图）**
   - 适用：Amazon主图、产品Listing
   - 参考：Mokker.ai的白底生成效果
   - Prompt结构：`Professional product photography of [产品名], pure white background, soft studio lighting, 45-degree angle, [品类特征], highly detailed, 8k resolution, commercial photography, [平台适配]`

2. **Lifestyle（场景图）**
   - 适用：社交媒体、广告图、详情页
   - 参考：Mokker.ai的100+场景模板
   - Prompt结构：`[产品名] on [场景], natural lighting, lifestyle product photography, cozy aesthetic, shallow depth of field, bokeh background, 8k resolution, [平台适配]`

3. **Detail Close-up（细节特写）**
   - 适用：展示材质/工艺/质感
   - 参考：珠宝/服装类目的细节图需求
   - Prompt结构：`Close-up macro shot of [产品名], [场景], highlighting [品类特征], soft directional lighting, professional product detail photography, 8k resolution, ultra sharp`

**平台适配规则（参考Mokker.ai的平台优化）：**
- Amazon: `Amazon product listing style, centered composition, fill frame 85%`
- Shopify: `Shopify product page style, lifestyle context, brand aesthetic`
- Etsy: `Etsy handmade style, warm natural light, artisan feel`
- Temu: `Temu marketplace style, vibrant colors, eye-catching composition`
- eBay: `eBay listing style, clear detailed view, neutral background`

**品类特征词库（参考Phot.AI的品类分析）：**
- Electronics: `highlighting sleek design, LED indicators, premium materials`
- Clothing: `showing texture, fabric drape, stitching details`
- Jewelry: `sparkling reflections, luxury feel, intricate details`
- Food: `appetizing presentation, fresh ingredients, vibrant colors`
- Furniture: `showing scale, craftsmanship, material quality`
- Beauty: `elegant packaging, premium feel, soft reflections`

### 3.2 第一期页面结构

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  HEADER                                                                     │
│  🎨 ProductPrompt.ai    [Features] [How it Works] [Pricing]                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  HERO SECTION                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  AI Product Photo Prompts in Seconds                                │   │
│  │  [Enter product name...]  [Platform▼] [Type▼]  [Generate]          │   │
│  │  Try: "Wireless Earbuds" · "Skincare Serum" · "Leather Wallet"     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  RESULTS SECTION（生成后显示）                                              │
│  ┌─ Prompt 1: White Background ─────────────────────────────────────┐   │
│  │  "Professional product photography of..."                    [Copy]│   │
│  ├─ Prompt 2: Lifestyle ────────────────────────────────────────────┤   │
│  │  "Wireless Bluetooth earbuds on marble desk..."            [Copy]│   │
│  ├─ Prompt 3: Detail Close-up ────────────────────────────────────┤   │
│  │  "Close-up macro shot of..."                               [Copy]│   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  FEATURES / HOW IT WORKS / PRICING / FOOTER                                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 第一期技术实现

| 模块 | 技术方案 | 参考 |
|------|---------|------|
| 前端框架 | Next.js 16 (App Router) | Vercel官方模板 |
| 样式 | Tailwind CSS 4 | Vercel官网设计风格 |
| 动画 | Framer Motion | Linear.app的动效 |
| 图标 | Lucide React | 统一图标风格 |
| 部署 | Vercel / Cloudflare Pages | 免费静态托管 |
| Prompt生成 | 纯前端规则引擎（无需后端API） | 参考PromptHero的模板逻辑 |

### 3.4 第一期成功指标

| 指标 | 目标值 | 验证方法 |
|------|--------|---------|
| 页面访问量 | > 100/天 | Vercel Analytics |
| 生成次数 | > 50/天 | 前端埋点 |
| 复制率 | > 30% | 复制按钮点击统计 |
| 用户反馈 | 收集10+条 | 页面底部反馈表单 |
| 留存率 | > 20%次日回访 | Cookie追踪 |

---

## 🚀 第二期：功能扩展期

> **目标**: 基于第一期数据，扩展功能提升留存和付费转化  
> **周期**: 3-4周  
> **对标网站**: Mokker.ai（批量功能）+ Pixa（高级编辑）+ ChatGPT（对话优化）  

### 4.1 第二期功能清单

#### 核心新增功能

| 功能ID | 功能名称 | 功能描述 | 优先级 | 对标参考 |
|--------|---------|---------|--------|---------|
| P2-F01 | **历史记录** | 保存最近20次生成记录，可重新复制 | P0 | ChatGPT的历史会话列表 |
| P2-F02 | **Prompt编辑** | 在页面上直接编辑Prompt，实时预览修改 | **P0** | **Pixa的编辑界面** |
| P2-F03 | **批量生成** | 一次输入多个产品名，批量生成Prompt | P1 | Mokker.ai的批量处理功能 |
| P2-F04 | **更多风格** | 增加：模特图/360度展示/包装图/对比图 | P1 | Mokker.ai的模板库 |
| P2-F05 | **AI优化建议** | 根据产品名自动建议"添加什么关键词效果更好" | **P0** | **ChatGPT的对话建议** |
| P2-F06 | **Prompt评分** | 给生成的Prompt打质量分（1-5星） | P2 | PromptHero的评分系统 |
| P2-F07 | **收藏Prompt** | 用户可收藏喜欢的Prompt到个人库 | P1 | PromptHero的收藏功能 |
| P2-F08 | **导出功能** | 导出所有Prompt为CSV/TXT | P2 | - |

#### Prompt编辑功能（参考Pixa的编辑体验）

```
┌─ Prompt Editor ─────────────────────────────────────────┐
│                                                           │
│  [Professional product photography of Wireless Earbuds,   │
│   pure white background, soft studio lighting,           │
│   45-degree angle, highlighting sleek design, 8k]        │
│                                                           │
│  💡 AI建议：                                               │
│  • 添加 "bokeh background" 可提升点击率 +15%              │
│  • 添加 "lifestyle context" 更适合社交媒体              │
│  • 当前Prompt质量评分：★★★★☆ (4.2/5)                    │
│                                                           │
│  [✨ Apply Suggestions]  [🔄 Regenerate]  [💾 Save]      │
└───────────────────────────────────────────────────────────┘
```

#### 历史记录功能（参考ChatGPT的会话列表）

```
┌─ History ───────────────────────────────────────────────┐
│                                                         │
│  📁 Today                                               │
│  • Wireless Earbuds (Amazon, Electronics) - 3 prompts │
│  • Skincare Serum (Shopify, Beauty) - 3 prompts       │
│  • Leather Wallet (Etsy, Accessories) - 3 prompts    │
│                                                         │
│  📁 Yesterday                                           │
│  • Coffee Mug (Amazon, Food) - 3 prompts              │
│                                                         │
│  [🗑️ Clear All]                                       │
└─────────────────────────────────────────────────────────┘
```

### 4.2 第二期技术升级

| 模块 | 升级方案 | 参考 |
|------|---------|------|
| 数据存储 | Vercel KV / Upstash Redis | Serverless KV存储 |
| 用户系统 | Clerk.dev / Auth.js | 快速接入认证 |
| AI建议 | OpenAI GPT-4o-mini API | 便宜且快 |
| 埋点分析 | Mixpanel / Amplitude | 精细化数据分析 |
| A/B测试 | Vercel Flags | 功能开关实验 |

### 4.3 第二期付费墙设计

**免费版限制（促转化）：**
- 每天5次生成
- 只能选3种基础风格
- 无历史记录
- 无AI优化建议
- 显示广告（AdSense）

**Pro版 $9.9/月（参考Mokker.ai的Pro定价）：**
- 无限生成
- 10+高级风格
- 历史记录（保存100条）
- AI优化建议
- 批量生成（最多10个产品）
- 导出功能
- 无广告

### 4.4 第二期成功指标

| 指标 | 目标值 |
|------|--------|
| 日活用户 | > 500 |
| 付费转化率 | > 2% |
| 用户留存（7日） | > 30% |
| 平均生成次数/人 | > 5 |
| NPS评分 | > 40 |

---

## 💎 第三期：平台化/生态期

> **目标**: 从工具升级为平台，建立护城河  
> **周期**: 6-8周  
> **对标网站**: Phot.AI（企业功能）+ Canva（生态化）+ Figma（社区化）  

### 5.1 第三期功能清单

#### 企业级功能（参考Phot.AI的企业版）

| 功能ID | 功能名称 | 功能描述 | 优先级 | 对标参考 |
|--------|---------|---------|--------|---------|
| P3-F01 | **API接口** | REST API供第三方调用生成Prompt | P0 | Phot.AI的API文档 |
| P3-F02 | **团队协作** | 多人共享Prompt库，权限管理 | P1 | Figma的团队空间 |
| P3-F03 | **品牌定制** | 自定义Prompt模板，保存品牌风格 | P1 | Canva的品牌套件 |
| P3-F04 | **数据分析** | 查看哪些Prompt生成效果最好 | P2 | Phot.AI的数据看板 |
| P3-F05 | **批量API** | 一次调用生成1000个产品的Prompt | P1 | Mokker.ai的企业API |

#### 社区/生态功能（参考Figma社区+PromptHero）

| 功能ID | 功能名称 | 功能描述 | 优先级 | 对标参考 |
|--------|---------|---------|--------|---------|
| P3-F06 | **Prompt市场** | 用户可分享/出售自己的Prompt模板 | P2 | PromptBase的 marketplace |
| P3-F07 | **社区投票** | 用户投票选出最佳Prompt，上榜展示 | P2 | Product Hunt的投票机制 |
| P3-F08 | **教程中心** | 教用户如何优化Prompt，提升技能 | P2 | PromptHero的博客 |
| P3-F09 | **集成插件** | Chrome插件/Shopify插件/VS Code插件 | P1 | Canva的插件生态 |
| P3-F10 | **多语言** | 支持中文/日文/德文/法文等 | P1 | - |

#### 智能化升级（参考ChatGPT的进化路径）

| 功能ID | 功能名称 | 功能描述 | 优先级 |
|--------|---------|---------|--------|
| P3-F11 | **图片反推Prompt** | 上传一张产品图，反推出生成它的Prompt | P1 |
| P3-F12 | **Prompt对比** | 同时生成A/B两个Prompt，预测哪个效果更好 | P2 |
| P3-F13 | **趋势Prompt** | 根据当前电商趋势，推荐热门风格Prompt | P2 |
| P3-F14 | **一键生成图片** | 直接调用Midjourney/Flux API生成图片（不是只给Prompt） | P0 |

### 5.2 第三期商业模式

**Enterprise版 $49/月（参考Phot.AI的企业定价）：**
- 包含Pro版所有功能
- API访问（10,000次/月）
- 团队协作（最多10人）
- 品牌定制模板
- 专属客服
- SLA保障

**API按量计费（参考OpenAI的定价模式）：**
- 免费：100次/月
- $19/月：5,000次
- $49/月：20,000次
- $99/月：50,000次

### 5.3 第三期成功指标

| 指标 | 目标值 |
|------|--------|
| 月收入(MRR) | > $5,000 |
| 付费用户 | > 500 |
| API调用量 | > 100K/月 |
| 企业客户 | > 10家 |
| 社区贡献者 | > 100人 |

---

## 六、技术架构演进

### 6.1 第一期架构（纯静态）

```
用户 → Vercel CDN → Next.js静态页面 → 浏览器
                    ↓
              纯前端规则引擎生成Prompt
```

**无需后端！** 所有Prompt通过前端JS规则生成，零服务器成本。

### 6.2 第二期架构（加轻量后端）

```
用户 → Vercel CDN → Next.js (API Routes)
                    ↓
              ┌─────┴─────┐
              ↓           ↓
         Vercel KV   OpenAI API
         (历史记录)   (AI建议)
```

### 6.3 第三期架构（完整平台）

```
用户 → Cloudflare CDN → Next.js (Full Stack)
                         ↓
              ┌─────────┼─────────┐
              ↓         ↓         ↓
         PostgreSQL  Redis    OpenAI API
         (用户数据)  (缓存)   (AI功能)
              ↓
         Stripe (支付)
              ↓
         SendGrid (邮件)
```

---

## 七、UI/UX设计规范

### 7.1 设计原则（参考Linear.app + Vercel）

| 原则 | 说明 |
|------|------|
| **极简** | 每页只做一件事，减少认知负担 |
| **快速** | 3秒内完成核心操作（输入→生成→复制） |
| **透明** | Prompt完全可见，让用户有掌控感 |
| **反馈** | 每个操作都有即时视觉反馈 |

### 7.2 色彩系统

| 用途 | 颜色 | Hex |
|------|------|-----|
| 主色（品牌） | 深蓝 | #1e3a5f |
| 强调色（CTA） | 橙色 | #f97316 |
| 成功 | 绿色 | #22c55e |
| 背景 | 浅灰 | #f8fafc |
| 文字 | 深灰 | #0f172a |
| 次要文字 | 中灰 | #64748b |

### 7.3 字体

- **标题**: Inter, system-ui, sans-serif
- **正文**: Inter, system-ui, sans-serif
- **Prompt代码**: JetBrains Mono / Fira Code, monospace

### 7.4 响应式断点

| 设备 | 宽度 | 布局 |
|------|------|------|
| 手机 | < 640px | 单列，全宽输入 |
| 平板 | 640-1024px | 双列，侧边栏 |
| 桌面 | > 1024px | 三列，完整功能 |

---

## 八、SEO策略

### 8.1 核心关键词布局

| 页面 | 标题(Title) | 描述(Description) | H1 |
|------|------------|-------------------|-----|
| 首页 | AI Product Photo Prompt Generator - ProductPrompt.ai | Generate professional prompts for Midjourney, Flux. Perfect for Amazon, Shopify, Etsy sellers. | AI Product Photo Prompts in Seconds |
| 博客-Amazon | Amazon Product Photo Prompts: 50 Templates | Best AI prompts for Amazon product photography. White background, lifestyle, detail shots. | Amazon Product Photo Prompts |
| 博客-Midjourney | Midjourney Product Photography Prompts | How to write product photo prompts for Midjourney. Examples and templates. | Midjourney Product Photo Prompts |
| 工具页 | Free AI Product Photo Prompt Generator | Free tool to generate product photo prompts. No signup required. | Free Product Photo Prompt Generator |

### 8.2 内容营销计划（参考PromptHero的博客策略）

| 文章主题 | 目标关键词 | 对标文章 |
|---------|----------|---------|
| 50 Best Product Photo Prompts for Midjourney | midjourney product photo prompts | PromptHero的模板文章 |
| How to Write Amazon Listing Image Prompts | amazon product photo prompt | Mokker.ai的教程 |
| AI Product Photography: Complete Guide 2025 | ai product photography | Phot.AI的行业报告 |
| 30 Prompts for Etsy Handmade Products | etsy product photo prompt | Etsy卖家论坛热门帖 |
| Flux vs Midjourney for Product Photos | flux product photo | AI工具对比文章 |

---

## 九、数据埋点计划

### 9.1 必须追踪的事件

| 事件 | 触发时机 | 用途 |
|------|---------|------|
| `page_view` | 页面加载 | 流量统计 |
| `generate_click` | 点击Generate按钮 | 核心功能使用 |
| `generate_success` | Prompt生成完成 | 功能可用性 |
| `copy_prompt` | 点击Copy按钮 | 价值验证（用户觉得有用才会复制） |
| `select_platform` | 选择平台 | 用户分布 |
| `select_type` | 选择产品类型 | 品类偏好 |
| `signup_click` | 点击Pro版升级 | 转化意向 |
| `feedback_submit` | 提交反馈 | 产品改进 |

### 9.2 数据分析看板

**每日必看指标：**
1. 访问量 / 生成次数 / 复制次数
2. 复制率 = 复制次数 / 生成次数
3. 热门产品类型 Top 5
4. 热门平台 Top 5
5. 用户来源（直接/搜索/社交）

---

## 十、风险与应对

| 风险 | 概率 | 影响 | 应对措施 |
|------|------|------|---------|
| 用户其实想要"一键生成图片"而非"Prompt" | 中 | 高 | MVP快速验证，不买单就加图片生成功能（P3-F14） |
| 竞品快速跟进Prompt功能 | 中 | 中 | 建立社区/内容壁垒，不只是工具 |
| SEO流量起不来 | 中 | 高 | 多平台分发（Reddit/YouTube/TikTok），不依赖单一渠道 |
| AI模型政策变化 | 低 | 中 | 支持多模型（Midjourney/Flux/DALL-E），不绑死一家 |
| 用户付费意愿低 | 中 | 高 | AdSense保底 + 免费增值模式 |

---

## 十一、附录

### A. 参考链接

| 网站 | URL | 参考内容 |
|------|-----|---------|
| Mokker.ai | https://www.mokker.ai | 首页输入体验、场景模板逻辑、平台适配 |
| Pixa (Pixelcut) | https://www.pixa.com | 编辑界面、批量功能、高级选项 |
| Phot.AI | https://www.phot.ai | 企业功能、数据分析、品类分类 |
| PromptHero | https://prompthero.com | Prompt卡片布局、复制按钮、评分系统 |
| PromptBase | https://promptbase.com | Marketplace模式、定价策略 |
| Linear.app | https://linear.app | 极简设计风格、动效 |
| Vercel.com | https://vercel.com | 响应式设计、技术文档风格 |
| ChatGPT | https://chat.openai.com | 对话建议、历史会话 |

### B. 文件目录结构

```
productprompt-ai/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # 首页（所有内容）
│   ├── layout.tsx                # 根布局
│   ├── globals.css               # 全局样式
│   └── blog/                     # 博客文章（第二期）
│       ├── amazon-prompts.mdx
│       ├── midjourney-guide.mdx
│       └── ...
├── components/                   # React组件
│   ├── HeroSection.tsx
│   ├── PromptInput.tsx
│   ├── PromptResults.tsx
│   ├── PromptCard.tsx
│   ├── PromptEditor.tsx          # 第二期
│   ├── HistoryPanel.tsx          # 第二期
│   ├── Features.tsx
│   ├── HowItWorks.tsx
│   ├── Pricing.tsx
│   └── Footer.tsx
├── lib/
│   ├── utils.ts                  # 工具函数
│   ├── promptGenerator.ts        # Prompt生成引擎
│   ├── promptTemplates.ts        # 模板库（第三期）
│   └── analytics.ts              # 埋点工具
├── hooks/
│   ├── usePromptHistory.ts       # 历史记录hook
│   └── useAnalytics.ts           # 埋点hook
├── types/
│   └── index.ts                  # TypeScript类型
├── public/
│   └── images/                   # 静态图片
├── docs/                           # 文档
│   └── PRD.md                      # 本文档
├── next.config.ts
├── tailwind.config.ts
├── package.json
└── README.md
```

### C. 更新日志

| 版本 | 日期 | 更新内容 |
|------|------|---------|
| v1.0 | 2026-05-05 | 初始版本，MVP已完成，定义三期规划 |

---

> **文档结束**  
> 如有疑问或需要调整，请联系产品经理。
