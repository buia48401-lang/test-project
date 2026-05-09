# ProductPrompt.ai 详细功能设计文档

> **版本**: v1.1  
> **日期**: 2026-05-05  
> **作者**: 陈凡AI编程  
> **状态**: 详细功能设计，可直接用于开发  

---

## 一、功能总览

### 1.1 功能清单（按优先级排序）

| 功能ID | 功能名称 | 所属期 | 优先级 | 状态 |
|--------|---------|--------|--------|------|
| F01 | 产品名称输入 | 第一期 | P0 | 已实现 |
| F02 | 平台选择 | 第一期 | P0 | 已实现 |
| F03 | 产品类型选择 | 第一期 | P0 | 已实现 |
| F04 | Prompt自动生成 | 第一期 | P0 | 已实现 |
| F05 | Prompt展示卡片 | 第一期 | P0 | 已实现 |
| F06 | 一键复制 | 第一期 | P0 | 已实现 |
| F07 | 示例产品快捷输入 | 第一期 | P1 | 已实现 |
| F08 | 响应式布局 | 第一期 | P0 | 已实现 |
| F09 | 历史记录 | 第二期 | P0 | 待开发 |
| F10 | Prompt编辑 | 第二期 | P0 | 待开发 |
| F11 | AI优化建议 | 第二期 | P0 | 待开发 |
| F12 | 批量生成 | 第二期 | P1 | 待开发 |
| F13 | 更多风格 | 第二期 | P1 | 待开发 |
| F14 | Prompt评分 | 第二期 | P2 | 待开发 |
| F15 | 收藏Prompt | 第二期 | P1 | 待开发 |
| F16 | 导出功能 | 第二期 | P2 | 待开发 |
| F17 | API接口 | 第三期 | P0 | 待开发 |
| F18 | 团队协作 | 第三期 | P1 | 待开发 |
| F19 | Prompt市场 | 第三期 | P2 | 待开发 |
| F20 | 一键生成图片 | 第三期 | P0 | 待开发 |

---

## 二、第一期功能详细设计

---

### F01: 产品名称输入

#### 2.1.1 功能描述
用户输入产品名称，系统基于名称生成对应的AI产品图Prompt。

#### 2.1.2 用户故事
> 作为Amazon卖家，我想输入"Wireless Bluetooth Earbuds"，让系统帮我生成专业的产品图Prompt，这样我就不用自己研究Prompt写法了。

#### 2.1.3 输入规范

| 属性 | 规范 |
|------|------|
| **字段类型** | 单行文本输入框 |
| **占位符文本** | "Enter your product name..." |
| **最大长度** | 100字符 |
| **最小长度** | 2字符（才能触发生成） |
| **允许字符** | 字母、数字、空格、连字符、括号、&、/ |
| **自动处理** | 前后空格自动trim |
| **禁用字符** | 特殊符号（@#$%^*等）自动过滤或提示 |

#### 2.1.4 交互流程

```
[用户操作]              [系统响应]
   │                        │
   ▼                        │
点击输入框 ──────────────→  输入框获得焦点，显示光标
   │                        │
   ▼                        │
输入"Wireless" ──────────→  实时显示输入内容，Generate按钮保持disabled
   │                        │
   ▼                        │
继续输入" Earbuds" ──────→  输入完成，Generate按钮变为enabled状态
   │                        │
   ▼                        │
按Enter/点击Generate ────→  触发Prompt生成流程（见F04）
   │                        │
   ▼                        │
输入过程中按ESC ─────────→  清空输入框，Generate按钮disabled
```

#### 2.1.5 边界情况

| 场景 | 系统行为 |
|------|---------|
| 输入为空时点击Generate | 按钮disabled，无法点击 |
| 输入只有空格 | trim后为空，按钮保持disabled |
| 输入超过100字符 | 截断到100字符，显示提示"Maximum 100 characters" |
| 输入包含特殊符号 | 允许&、/、-、()，其他符号提示"Invalid character" |
| 粘贴长文本 | 自动截断到100字符 |
| 快速多次按Enter | 防抖处理，300ms内只触发一次 |
| 输入框失去焦点 | 保留内容，不自动清空 |

#### 2.1.6 错误处理

| 错误码 | 场景 | 提示文案 |
|--------|------|---------|
| E01 | 输入为空 | "Please enter a product name" |
| E02 | 输入过短（<2字符） | "Product name too short" |
| E03 | 输入过长（>100字符） | "Maximum 100 characters" |
| E04 | 包含非法字符 | "Invalid characters detected" |

#### 2.1.7 性能要求
- 输入响应延迟 < 16ms（60fps）
- 输入框渲染时间 < 100ms

---

### F02: 平台选择

#### 2.2.1 功能描述
用户选择产品将要上架的电商平台，系统根据平台特性调整Prompt中的平台适配描述。

#### 2.2.2 用户故事
> 作为多平台卖家，我在Amazon和Etsy都有店铺。我想为不同平台生成不同风格的Prompt，因为Amazon要白底图，Etsy要温暖的手工感。

#### 2.2.3 选项定义

| 选项值 | 显示名称 | 平台适配Prompt片段 |
|--------|---------|-------------------|
| default | All Platforms | "ecommerce product photography, commercial quality" |
| amazon | Amazon | "Amazon product listing style, centered composition, fill frame 85%, pure white background required" |
| shopify | Shopify | "Shopify product page style, lifestyle context, brand aesthetic, web-optimized" |
| etsy | Etsy | "Etsy handmade style, warm natural light, artisan feel, cozy atmosphere" |
| temu | Temu | "Temu marketplace style, vibrant colors, eye-catching composition, competitive pricing feel" |
| ebay | eBay | "eBay listing style, clear detailed view, neutral background, trustworthy presentation" |

#### 2.2.4 交互流程

```
[用户操作]              [系统响应]
   │                        │
   ▼                        │
点击"All Platforms"按钮 ─→  展开下拉菜单，显示6个选项
   │                        │
   ▼                        │
鼠标悬停某选项 ──────────→  该选项高亮显示（bg-blue-50）
   │                        │
   ▼                        │
点击"Amazon" ────────────→  下拉菜单关闭，按钮显示"Amazon"
   │                        │
   ▼                        │
再次点击按钮 ────────────→  重新展开下拉菜单，当前选中项高亮
   │                        │
   ▼                        │
点击外部区域 ────────────→  下拉菜单关闭（不更改选择）
```

#### 2.2.5 界面元素

```
┌─ Platform Selector ─────────────────────────┐
│                                              │
│  [All Platforms ▼]                           │
│                                              │
│  ┌─ Dropdown ──────────────────────────┐   │
│  │  ○ All Platforms                     │   │
│  │  ● Amazon        ← 当前选中          │   │
│  │  ○ Shopify                           │   │
│  │  ○ Etsy                              │   │
│  │  ○ Temu                              │   │
│  │  ○ eBay                              │   │
│  └──────────────────────────────────────┘   │
│                                              │
└──────────────────────────────────────────────┘
```

#### 2.2.6 边界情况

| 场景 | 系统行为 |
|------|---------|
| 首次访问 | 默认选中"All Platforms" |
| 选择后刷新页面 | 记住上次选择（localStorage） |
| 快速切换选项 | 防抖处理，只保留最后一次选择 |
| 移动端显示 | 下拉菜单全屏显示，底部有"Close"按钮 |

#### 2.2.7 数据存储
- 存储位置: localStorage
- Key: `productprompt_platform`
- 过期: 30天

---

### F03: 产品类型选择

#### 2.3.1 功能描述
用户选择产品所属品类，系统根据品类特性添加对应的特征描述词到Prompt中。

#### 2.3.2 用户故事
> 我卖珠宝和电子产品，我知道珠宝需要"sparkling reflections"，电子产品需要"sleek design"。我希望系统自动加上这些特征词。

#### 2.3.3 选项定义

| 选项值 | 显示名称 | 特征词 | 场景词库 |
|--------|---------|--------|---------|
| default | General | "high quality, professional finish" | 通用场景 |
| electronics | Electronics | "highlighting sleek design, LED indicators, premium materials, modern aesthetic" | tech desk, workspace, unboxing |
| clothing | Clothing | "showing texture, fabric drape, stitching details, natural folds" | flat lay, boutique, linen fabric |
| jewelry | Jewelry | "sparkling reflections, luxury feel, intricate details, precious metal shine" | velvet tray, model hand, reflective surface |
| food | Food | "appetizing presentation, fresh ingredients, vibrant colors, delicious appeal" | rustic table, ceramic plate, slate board |
| furniture | Furniture | "showing scale, craftsmanship, material quality, comfortable design" | living room, reading nook, studio space |
| beauty | Beauty | "elegant packaging, premium feel, soft reflections, luxurious texture" | vanity table, bathroom shelf, spa setting |

#### 2.3.4 品类特征词详细定义

**Electronics（3C电子）**
- 特征词: `highlighting sleek design, LED indicators, premium materials, modern aesthetic, matte finish, precision engineering`
- 场景库: 
  - "modern minimalist desk with laptop and coffee"
  - "clean tech workspace with soft ambient lighting"
  - "premium unboxing scene with soft shadows"
  - "nightstand with warm bedside lamp"

**Clothing（服装）**
- 特征词: `showing texture, fabric drape, stitching details, natural folds, comfortable fit, quality material`
- 场景库:
  - "flat lay on marble surface with accessories"
  - "hanging on wooden rack in boutique setting"
  - "folded neatly on linen fabric with natural light"
  - "on model with neutral background"

**Jewelry（珠宝）**
- 特征词: `sparkling reflections, luxury feel, intricate details, precious metal shine, gemstone brilliance, delicate craftsmanship`
- 场景库:
  - "velvet display tray with soft spotlight"
  - "on model's hand with blurred garden background"
  - "macro on reflective surface with bokeh lights"
  - "elegant jewelry box with satin interior"

**Food（食品）**
- 特征词: `appetizing presentation, fresh ingredients, vibrant colors, delicious appeal, mouth-watering, gourmet quality`
- 场景库:
  - "rustic wooden table with ingredients around"
  - "clean ceramic plate with herb garnish"
  - "overhead flat lay on slate board"
  - "kitchen counter with morning light"

**Furniture（家具）**
- 特征词: `showing scale, craftsmanship, material quality, comfortable design, elegant lines, durable construction`
- 场景库:
  - "modern living room with natural daylight"
  - "cozy reading nook with warm lighting"
  - "minimalist studio space with plants"
  - "scandinavian interior with soft textures"

**Beauty（美妆）**
- 特征词: `elegant packaging, premium feel, soft reflections, luxurious texture, glossy finish, sophisticated design`
- 场景库:
  - "vanity table with rose petals and mirror"
  - "bathroom shelf with soft morning light"
  - "spa setting with candles and towels"
  - "dressing table with gold accents"

#### 2.3.5 交互流程
与F02平台选择完全一致，只是选项不同。

#### 2.3.6 数据存储
- 存储位置: localStorage
- Key: `productprompt_type`
- 过期: 30天

---

### F04: Prompt自动生成

#### 2.4.1 功能描述
系统的核心功能。基于用户输入的产品名、选择的平台、选择的类型，自动生成3种不同风格的专业产品图Prompt。

#### 2.4.2 用户故事
> 我输入"Wireless Bluetooth Earbuds"，选择Amazon和Electronics，系统应该给我3个Prompt：一个白底图（适合Amazon主图）、一个场景图（适合广告）、一个细节图（展示产品质感）。

#### 2.4.3 生成逻辑详解

**输入参数：**
```typescript
interface GenerateParams {
  productName: string;    // 产品名称
  platform: string;       // 平台标识
  productType: string;    // 品类标识
}
```

**输出结构：**
```typescript
interface PromptResult {
  id: string;             // 风格标识: "white" | "lifestyle" | "detail"
  title: string;          // 显示标题
  style: string;          // 风格类型
  icon: string;           // 图标名称
  prompt: string;         // 完整Prompt文本
}

interface GeneratedPrompt {
  productName: string;
  platform: string;
  productType: string;
  prompts: PromptResult[];
}
```

**生成算法：**

```
function generatePrompts(productName, platform, productType):
  
  // 1. 获取平台适配片段
  platformModifier = PLATFORM_MODIFIERS[platform] || PLATFORM_MODIFIERS.default
  
  // 2. 获取品类特征词
  typeHints = TYPE_HINTS[productType] || TYPE_HINTS.default
  
  // 3. 获取场景描述（根据品类和风格）
  scene = getScene(productType, style)
  
  // 4. 组装3种风格的Prompt
  prompts = []
  
  // 4.1 白底图风格
  prompts.push({
    id: "white",
    title: "White Background",
    style: "white",
    icon: "Square",
    prompt: `Professional product photography of ${productName}, 
            pure white background, soft studio lighting, 
            45-degree angle, ${typeHints}, 
            highly detailed, 8k resolution, commercial photography, 
            ${platformModifier}`
  })
  
  // 4.2 场景图风格
  prompts.push({
    id: "lifestyle",
    title: "Lifestyle Scene",
    style: "lifestyle", 
    icon: "Image",
    prompt: `${productName} on ${scene}, 
            natural lighting, lifestyle product photography, 
            cozy aesthetic, shallow depth of field, bokeh background, 
            8k resolution, ${platformModifier}`
  })
  
  // 4.3 细节图风格
  prompts.push({
    id: "detail",
    title: "Detail Close-up",
    style: "detail",
    icon: "ZoomIn",
    prompt: `Close-up macro shot of ${productName}, 
            ${scene}, highlighting ${typeHints}, 
            soft directional lighting, professional product detail photography, 
            8k resolution, ultra sharp`
  })
  
  return { productName, platform, productType, prompts }
```

#### 2.4.4 Prompt模板库

**平台适配片段库（PLATFORM_MODIFIERS）：**
```javascript
const PLATFORM_MODIFIERS = {
  default: "ecommerce product photography, commercial quality, professional lighting",
  amazon: "Amazon product listing style, centered composition, fill frame 85%, pure white background required, marketplace optimized",
  shopify: "Shopify product page style, lifestyle context, brand aesthetic, web-optimized, e-commerce ready",
  etsy: "Etsy handmade style, warm natural light, artisan feel, cozy atmosphere, handcrafted aesthetic",
  temu: "Temu marketplace style, vibrant colors, eye-catching composition, competitive pricing feel, discount store aesthetic",
  ebay: "eBay listing style, clear detailed view, neutral background, trustworthy presentation, second-hand friendly"
}
```

**品类特征词库（TYPE_HINTS）：**
```javascript
const TYPE_HINTS = {
  default: "high quality, professional finish, attention to detail",
  electronics: "highlighting sleek design, LED indicators, premium materials, modern aesthetic, matte finish, precision engineering",
  clothing: "showing texture, fabric drape, stitching details, natural folds, comfortable fit, quality material",
  jewelry: "sparkling reflections, luxury feel, intricate details, precious metal shine, gemstone brilliance, delicate craftsmanship",
  food: "appetizing presentation, fresh ingredients, vibrant colors, delicious appeal, mouth-watering, gourmet quality",
  furniture: "showing scale, craftsmanship, material quality, comfortable design, elegant lines, durable construction",
  beauty: "elegant packaging, premium feel, soft reflections, luxurious texture, glossy finish, sophisticated design"
}
```

**场景词库（SCENES）：**
```javascript
const SCENES = {
  default: {
    lifestyle: "clean modern surface with soft shadows",
    detail: "premium display with elegant background"
  },
  electronics: {
    lifestyle: "modern minimalist desk with laptop and coffee",
    detail: "premium unboxing scene with soft shadows"
  },
  clothing: {
    lifestyle: "flat lay on marble surface with accessories",
    detail: "boutique display with soft spotlight"
  },
  jewelry: {
    lifestyle: "velvet display tray with soft spotlight",
    detail: "macro on reflective surface with bokeh lights"
  },
  food: {
    lifestyle: "rustic wooden table with ingredients around",
    detail: "overhead flat lay on slate board"
  },
  furniture: {
    lifestyle: "modern living room with natural daylight",
    detail: "scandinavian interior with soft textures"
  },
  beauty: {
    lifestyle: "vanity table with rose petals and mirror",
    detail: "spa setting with candles and towels"
  }
}
```

#### 2.4.5 完整Prompt示例

**输入：**
- 产品名: "Wireless Bluetooth Earbuds"
- 平台: "amazon"
- 品类: "electronics"

**输出：**

Prompt 1 - White Background:
```
Professional product photography of Wireless Bluetooth Earbuds, 
pure white background, soft studio lighting, 45-degree angle, 
highlighting sleek design, LED indicators, premium materials, modern aesthetic, matte finish, precision engineering, 
highly detailed, 8k resolution, commercial photography, 
Amazon product listing style, centered composition, fill frame 85%, pure white background required, marketplace optimized
```

Prompt 2 - Lifestyle Scene:
```
Wireless Bluetooth Earbuds on modern minimalist desk with laptop and coffee, 
natural lighting, lifestyle product photography, cozy aesthetic, 
shallow depth of field, bokeh background, 8k resolution, 
Amazon product listing style, centered composition, fill frame 85%, pure white background required, marketplace optimized
```

Prompt 3 - Detail Close-up:
```
Close-up macro shot of Wireless Bluetooth Earbuds, 
premium unboxing scene with soft shadows, 
highlighting sleek design, LED indicators, premium materials, modern aesthetic, matte finish, precision engineering, 
soft directional lighting, professional product detail photography, 
8k resolution, ultra sharp
```

#### 2.4.6 性能要求
- 生成延迟 < 100ms（纯前端计算，无需API调用）
- 内存占用 < 1MB

---

### F05: Prompt展示卡片

#### 2.5.1 功能描述
以卡片形式展示生成的3个Prompt，每个卡片包含：风格标题、风格描述、Prompt文本、复制按钮。

#### 2.5.2 用户故事
> 生成Prompt后，我想一眼看出哪个是白底图、哪个是场景图。卡片布局让我能快速浏览，找到我需要的Prompt。

#### 2.5.3 卡片结构

```
┌─ Prompt Card ─────────────────────────────────────────┐
│                                                        │
│  ┌─ Header ─────────────────────────────────────────┐ │
│  │  ┌─ Icon ─┐  ┌─ Title ───────────┐  ┌─ Copy ─┐  │ │
│  │  │  🟦    │  │ White Background   │  │  Copy  │  │ │
│  │  └────────┘  │ (白底产品图)        │  └────────┘  │ │
│  │              │ 适合Amazon主图      │              │ │
│  │              └─────────────────────┘              │ │
│  └───────────────────────────────────────────────────┘ │
│                                                        │
│  ┌─ Body ────────────────────────────────────────────┐  │
│  │                                                   │  │
│  │  "Professional product photography of            │  │
│  │   Wireless Bluetooth Earbuds, pure white         │  │
│  │   background, soft studio lighting, ..."         │  │
│  │                                                   │  │
│  └───────────────────────────────────────────────────┘  │
│                                                        │
└────────────────────────────────────────────────────────┘
```

#### 2.5.4 卡片属性

| 属性 | 白底图卡片 | 场景图卡片 | 细节图卡片 |
|------|-----------|-----------|-----------|
| **ID** | white | lifestyle | detail |
| **标题** | White Background | Lifestyle Scene | Detail Close-up |
| **副标题** | 白底产品图 | 场景氛围图 | 细节特写图 |
| **描述** | 适合Amazon主图、产品Listing | 适合社交媒体、广告图 | 展示材质、工艺、质感 |
| **图标** | Square (方块) | Image (图片) | ZoomIn (放大镜) |
| **图标颜色** | bg-blue-50, text-blue-600 | bg-green-50, text-green-600 | bg-purple-50, text-purple-600 |
| **Prompt字体** | JetBrains Mono, 14px, slate-700 | 同上 | 同上 |
| **行高** | 1.6 | 1.6 | 1.6 |

#### 2.5.5 动画效果

**入场动画（Framer Motion）：**
```
初始状态: opacity: 0, x: -20
动画状态: opacity: 1, x: 0
持续时间: 0.3秒
延迟: 第一张0ms, 第二张100ms, 第三张200ms
缓动: ease-out
```

**悬停效果：**
```
默认: shadow-sm
悬停: shadow-md, translateY(-2px)
过渡: 0.2s ease
```

#### 2.5.6 响应式布局

**桌面端（>1024px）：**
- 3张卡片垂直排列，每张宽度100%
- 间距: 16px

**平板端（640-1024px）：**
- 同上

**手机端（<640px）：**
- 同上，但卡片内边距减小
- 字体缩小到13px

---

### F06: 一键复制

#### 2.6.1 功能描述
用户点击复制按钮，将对应Prompt文本复制到系统剪贴板，并提供视觉反馈。

#### 2.6.2 用户故事
> 我看到一个好的Prompt，想复制到Midjourney里用。一键复制比手动选中文字方便多了。

#### 2.6.3 交互流程

```
[用户操作]              [系统响应]
   │                        │
   ▼                        │
点击Copy按钮 ────────────→  调用navigator.clipboard.writeText()
   │                        │
   ▼                        │
复制成功 ────────────────→  按钮变为绿色，显示"Copied!" + Check图标
   │                        │
   ▼                        │
2秒后 ───────────────────→  按钮恢复默认状态，显示"Copy" + Copy图标
```

#### 2.6.4 按钮状态

| 状态 | 显示 | 颜色 | 图标 |
|------|------|------|------|
| **默认** | "Copy" | bg-slate-100, text-slate-700 | Copy (复制图标) |
| **悬停** | "Copy" | bg-slate-200, text-slate-800 | Copy |
| **点击中** | "Copy" | bg-slate-300 | Copy |
| **成功** | "Copied!" | bg-green-50, text-green-600 | Check (勾选图标) |
| **失败** | "Failed" | bg-red-50, text-red-600 | X (叉号图标) |

#### 2.6.5 错误处理

| 场景 | 系统行为 |
|------|---------|
| 剪贴板API不可用 | 降级方案：选中Prompt文本，提示用户手动复制 |
| 复制失败 | 显示"Failed"状态，1秒后恢复，可重试 |
| 权限被拒绝 | 提示"Please allow clipboard access" |

#### 2.6.6 埋点事件
- 事件名: `copy_prompt`
- 参数: `{ prompt_id, prompt_style, product_name, platform, product_type }`

---

### F07: 示例产品快捷输入

#### 2.7.1 功能描述
在输入框下方显示4个预设产品名按钮，点击后自动填充到输入框并触发生成。

#### 2.7.2 用户故事
> 我第一次来这个网站，不知道输入什么。看到示例按钮，我点一下就能看效果，不用自己想产品名。

#### 2.7.3 示例产品列表

| 显示名称 | 实际填充值 | 默认平台 | 默认类型 |
|---------|----------|---------|---------|
| "Wireless Earbuds" | "Wireless Bluetooth Earbuds" | Amazon | Electronics |
| "Skincare Serum" | "Vitamin C Skincare Serum" | Shopify | Beauty |
| "Leather Wallet" | "Genuine Leather Wallet" | Etsy | General |
| "Coffee Mug" | "Ceramic Coffee Mug" | Amazon | Food |

#### 2.7.4 交互流程

```
[用户操作]              [系统响应]
   │                        │
   ▼                        │
点击"Wireless Earbuds" ──→  输入框填充"Wireless Bluetooth Earbuds"
   │                        │
   ▼                        │
自动选择平台 ─────────────→  平台选择器变为"Amazon"
   │                        │
   ▼                        │
自动选择类型 ─────────────→  类型选择器变为"Electronics"
   │                        │
   ▼                        │
自动触发生成 ─────────────→  执行Prompt生成，显示结果卡片
```

#### 2.7.5 边界情况

| 场景 | 系统行为 |
|------|---------|
| 用户已输入内容 | 覆盖原有内容，提示"Example loaded" |
| 用户已选择平台/类型 | 覆盖为示例对应的平台/类型 |
| 快速点击多个示例 | 防抖处理，只执行最后一次 |

---

### F08: 响应式布局

#### 2.8.1 功能描述
页面在不同设备尺寸下自适应显示，保证手机、平板、桌面都有良好体验。

#### 2.8.2 断点定义

| 断点名称 | 宽度范围 | 设备类型 | 布局策略 |
|---------|---------|---------|---------|
| sm | < 640px | 手机 | 单列，全宽，紧凑间距 |
| md | 640-768px | 大手机/小平板 | 单列，稍宽 |
| lg | 768-1024px | 平板 | 双列（输入区+结果区并排） |
| xl | 1024-1280px | 小桌面 | 双列，更宽 |
| 2xl | > 1280px | 大桌面 | 双列，最大宽度限制 |

#### 2.8.3 各区域响应式行为

**Header区域：**
- 手机：只显示Logo，导航隐藏到汉堡菜单
- 平板+桌面：显示完整导航

**Hero/输入区域：**
- 手机：垂直堆叠（输入框→平台→类型→按钮）
- 平板+桌面：水平排列（输入框+平台+类型+按钮在一行）

**结果卡片区域：**
- 所有设备：垂直堆叠
- 手机：卡片内边距16px
- 桌面：卡片内边距24px

**Pricing区域：**
- 手机：垂直堆叠
- 平板：2列
- 桌面：3列

#### 2.8.4 字体响应式

| 元素 | 手机 | 平板 | 桌面 |
|------|------|------|------|
| H1标题 | 28px | 36px | 48px |
| H2标题 | 22px | 28px | 30px |
| 正文 | 14px | 15px | 16px |
| Prompt文本 | 13px | 14px | 14px |
| 按钮文字 | 14px | 15px | 16px |

---

## 三、第二期功能详细设计

---

### F09: 历史记录

#### 3.1.1 功能描述
保存用户最近生成的Prompt记录，支持查看、复制、删除。

#### 3.1.2 用户故事
> 我昨天生成了一个很好的Prompt，今天想再用但忘了具体内容。如果有历史记录，我就能找到并直接复制。

#### 3.1.3 数据模型

```typescript
interface HistoryItem {
  id: string;                    // 唯一ID (UUID)
  productName: string;           // 产品名称
  platform: string;             // 平台
  productType: string;          // 品类
  prompts: PromptResult[];      // 生成的3个Prompt
  createdAt: number;             // 创建时间戳
  copiedCount: number;          // 被复制次数
}

interface HistoryStorage {
  items: HistoryItem[];
  maxItems: number;             // 最大保存数量: 20
}
```

#### 3.1.4 存储方案

**方案A: localStorage（MVP先用这个）**
- 优点：简单，无需后端
- 缺点：换设备/浏览器丢失，容量限制5MB
- 实现：JSON.stringify存储

**方案B: Vercel KV（第二期推荐）**
- 优点：跨设备同步，容量大
- 缺点：需要用户登录
- 实现：用户ID作为key

#### 3.1.5 界面设计

```
┌─ History Panel ─────────────────────────────────────────┐
│                                                          │
│  📁 History (12 items)                    [🗑️ Clear All] │
│                                                          │
│  ┌─ Today ───────────────────────────────────────────┐ │
│  │                                                     │ │
│  │  ┌─ Item ─────────────────────────────────────────┐ │ │
│  │  │  🎧 Wireless Earbuds                           │ │ │
│  │  │  Amazon · Electronics · 3 prompts              │ │ │
│  │  │  2 hours ago · copied 3 times                  │ │ │
│  │  │                                    [📋 Copy]   │ │ │
│  │  └────────────────────────────────────────────────┘ │ │
│  │                                                     │ │
│  │  ┌─ Item ─────────────────────────────────────────┐ │ │
│  │  │  💄 Skincare Serum                             │ │ │
│  │  │  Shopify · Beauty · 3 prompts                │ │ │
│  │  │  5 hours ago · copied 1 time                   │ │ │
│  │  │                                    [📋 Copy]   │ │ │
│  │  └────────────────────────────────────────────────┘ │ │
│  │                                                     │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌─ Yesterday ─────────────────────────────────────────┐ │
│  │  ...                                                │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

#### 3.1.6 交互流程

```
[用户操作]              [系统响应]
   │                        │
   ▼                        │
点击History按钮 ─────────→  展开侧边栏/弹窗，显示历史列表
   │                        │
   ▼                        │
点击某条历史的Copy ──────→  复制该条历史的全部3个Prompt
   │                        │
   ▼                        │
点击某条历史 ────────────→  展开显示3个Prompt卡片
   │                        │
   ▼                        │
点击Delete ──────────────→  确认弹窗"Delete this record?"
   │                        │
   ▼                        │
确认删除 ────────────────→  从历史列表移除，更新localStorage
```

#### 3.1.7 边界情况

| 场景 | 系统行为 |
|------|---------|
| 历史记录满20条 | 删除最旧的一条，添加新记录 |
| 无历史记录 | 显示"No history yet. Generate your first prompt!" |
| 存储空间不足 | 提示"Storage full. Please clear some history." |
| 隐私模式/禁用localStorage | 提示"History not available in private mode" |

---

### F10: Prompt编辑

#### 3.2.1 功能描述
用户可以直接在页面上编辑生成的Prompt，实时看到修改后的效果。

#### 3.2.2 用户故事
> 系统生成的Prompt很好，但我想微调一下。比如我想把"white background"改成"light gray background"。如果能直接编辑，就不用复制到别处改了。

#### 3.2.3 界面设计

```
┌─ Prompt Editor ───────────────────────────────────────────┐
│                                                            │
│  ┌─ Header ───────────────────────────────────────────┐  │
│  │  ✏️ Edit Prompt                    [💾 Save] [❌ Cancel]│  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│  ┌─ Text Area ────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Professional product photography of              │   │
│  │  Wireless Bluetooth Earbuds,                      │   │
│  │  ┌─ light gray background ─┐  ← 用户修改的部分    │   │
│  │  │  (was: white background) │    高亮显示           │   │
│  │  └─────────────────────────┘                      │   │
│  │  soft studio lighting, 45-degree angle,           │   │
│  │  highlighting sleek design, 8k...                  │   │
│  │                                                     │   │
│  │  Character count: 245/500                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                            │
│  ┌─ AI Suggestions ───────────────────────────────────┐   │
│  │  💡 Suggestions based on your edits:                 │   │
│  │  • Try "matte finish" for premium feel              │   │
│  │  • Add "lifestyle context" for social media         │   │
│  │  • Remove "pure white" if using gray background     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

#### 3.2.4 编辑功能

| 功能 | 说明 |
|------|------|
| **文本编辑** | 可自由修改Prompt文本 |
| **字符计数** | 实时显示当前字符数/最大字符数（默认500） |
| **修改高亮** | 与原始Prompt对比，修改的部分高亮显示 |
| **重置** | 一键恢复原始Prompt |
| **保存** | 保存编辑后的Prompt到历史记录 |
| **取消** | 放弃编辑，关闭编辑器 |

#### 3.2.5 技术实现

```typescript
interface PromptEditorState {
  originalPrompt: string;        // 原始Prompt
  editedPrompt: string;          // 编辑后的Prompt
  isDirty: boolean;             // 是否有修改
  charCount: number;            // 当前字符数
  maxChars: number;             // 最大字符数: 500
}

// 对比算法：找出差异部分
function findDifferences(original: string, edited: string): Diff[] {
  // 使用diff-match-patch库或简单字符串对比
}
```

---

### F11: AI优化建议

#### 3.3.1 功能描述
基于用户的产品名和当前Prompt，AI给出优化建议，帮助用户写出更好的Prompt。

#### 3.3.2 用户故事
> 我生成了一个Prompt，但不知道好不好。如果系统能告诉我"添加bokeh background可以提升点击率"，我就能优化Prompt效果。

#### 3.3.3 建议类型

| 建议类型 | 示例 | 触发条件 |
|---------|------|---------|
| **添加关键词** | "添加'bokeh background'可提升点击率+15%" | 当前Prompt缺少背景描述 |
| **删除关键词** | "删除'8k'，Midjourney默认已足够高清" | 包含冗余关键词 |
| **替换关键词** | "将'good lighting'替换为'soft studio lighting'更专业" | 关键词不够专业 |
| **结构调整** | "将产品名放在Prompt开头效果更好" | 产品名不在前20%位置 |
| **平台适配** | "Amazon要求85%填充率，建议添加'fill frame'" | 平台特定要求 |

#### 3.3.4 实现方案

**方案A: 规则引擎（先用这个，免费）**
- 基于关键词匹配和规则判断
- 优点：免费、快速、可控
- 缺点：不够智能

**方案B: OpenAI API（第二期加）**
- 调用GPT-4o-mini分析Prompt并给出建议
- 优点：智能、准确
- 缺点：有API成本

#### 3.3.5 规则引擎示例

```javascript
const SUGGESTION_RULES = [
  {
    id: "add-bokeh",
    check: (prompt) => !prompt.includes("bokeh") && !prompt.includes("blur"),
    message: "添加 'bokeh background' 可提升视觉层次感",
    impact: "+15% CTR"
  },
  {
    id: "remove-8k",
    check: (prompt) => prompt.includes("8k") && prompt.includes("highly detailed"),
    message: "删除 '8k'，保留 'highly detailed' 即可",
    impact: "节省token"
  },
  {
    id: "add-fill-frame",
    check: (prompt, platform) => platform === "amazon" && !prompt.includes("fill frame"),
    message: "Amazon要求85%填充率，添加 'fill frame 85%'",
    impact: "符合平台规范"
  }
]
```

---

### F12: 批量生成

#### 3.4.1 功能描述
用户一次输入多个产品名，系统批量生成每个产品的Prompt。

#### 3.4.2 用户故事
> 我有50个产品要上架，一个一个生成太慢了。如果能一次输入所有产品名，批量生成Prompt，效率会高很多。

#### 3.4.3 输入方式

**方式A: 文本框批量输入**
```
Enter products (one per line):
┌─ Text Area ──────────────────────────┐
│ Wireless Bluetooth Earbuds           │
│ Leather Wallet                       │
│ Ceramic Coffee Mug                   │
│ Vitamin C Serum                      │
│ ...                                  │
└──────────────────────────────────────┘
Maximum 10 products per batch
```

**方式B: CSV上传（第三期）**
- 上传CSV文件，包含产品名、平台、类型列

#### 3.4.4 输出格式

```
┌─ Batch Results ──────────────────────────────────────────┐
│                                                         │
│  Generated 10 products (30 prompts)                    │
│  [📥 Export All]                                       │
│                                                         │
│  ┌─ Product 1: Wireless Bluetooth Earbuds ──────────┐ │
│  │  [📋 Copy White] [📋 Copy Lifestyle] [📋 Copy Detail]│ │
│  └────────────────────────────────────────────────────┘ │
│  ┌─ Product 2: Leather Wallet ─────────────────────────┐ │
│  │  [📋 Copy White] [📋 Copy Lifestyle] [📋 Copy Detail]│ │
│  └────────────────────────────────────────────────────┘ │
│  ...                                                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### 3.4.5 限制

| 限制项 | 免费版 | Pro版 |
|--------|--------|-------|
| 单次批量数量 | 3个产品 | 10个产品 |
| 每月批量次数 | 10次 | 无限 |
| 导出格式 | 仅复制 | CSV/TXT下载 |

---

### F13: 更多风格

#### 3.5.1 功能描述
在基础的3种风格（白底/场景/细节）之外，增加更多专业风格选项。

#### 3.5.2 新增风格

| 风格ID | 风格名称 | 适用场景 | Prompt特征 |
|--------|---------|---------|-----------|
| model | 模特展示 | 服装/配饰 | "worn by professional model, full body shot" |
| 360 | 360度展示 | 电子产品/珠宝 | "360 degree product view, rotating display" |
| package | 包装展示 | 礼品/美妆 | "premium packaging, unboxing experience, gift ready" |
| compare | 对比图 | 所有品类 | "before and after comparison, split screen" |
| flatlay | 平铺俯拍 | 服装/食品 | "flat lay, top-down view, arranged composition" |
| macro | 微距特写 | 珠宝/美妆 | "extreme macro, microscopic detail, texture focus" |
| night | 夜景氛围 | 电子产品/汽车 | "night scene, neon lighting, cyberpunk aesthetic" |
| vintage | 复古风格 | 服装/家具 | "vintage film look, retro color grading, nostalgic" |

#### 3.5.3 风格选择界面

```
┌─ Style Selector ────────────────────────────────────────┐
│                                                          │
│  Basic Styles (Free)          Pro Styles               │
│  ┌─────────┐ ┌─────────┐      ┌─────────┐ ┌─────────┐ │
│  │ ⬜ White│ │ 🖼️ Life │      │ 👤 Model│ │ 🔄 360  │ │
│  │Background│ │ style  │      │  Shot   │ │  View   │ │
│  └─────────┘ └─────────┘      └─────────┘ └─────────┘ │
│  ┌─────────┐                    ┌─────────┐ ┌─────────┐ │
│  │ 🔍 Detail│                    │ 📦 Pack │ │ ⚖️ Comp │ │
│  │ Close-up│                    │  aging  │ │  are    │ │
│  └─────────┘                    └─────────┘ └─────────┘ │
│                                  ┌─────────┐ ┌─────────┐ │
│                                  │ 📐 Flat │ │ 🔬 Macro│ │
│                                  │  Lay    │ │  Shot   │ │
│                                  └─────────┘ └─────────┘ │
│                                  ┌─────────┐ ┌─────────┐ │
│                                  │ 🌙 Night│ │ 📻 Vint │ │
│                                  │  Scene  │ │  age    │ │
│                                  └─────────┘ └─────────┘ │
│                                                          │
│  [✨ Upgrade to Pro to unlock 8+ premium styles]        │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

### F14: Prompt评分

#### 3.6.1 功能描述
系统给生成的Prompt打质量分，帮助用户判断Prompt的好坏。

#### 3.6.2 评分维度

| 维度 | 权重 | 说明 |
|------|------|------|
| **完整性** | 25% | 是否包含必要元素（产品名、背景、光线、质量词） |
| **专业性** | 25% | 是否使用专业摄影术语 |
| **平台适配** | 20% | 是否符合选定平台的要求 |
| **创意性** | 15% | 是否有独特的描述角度 |
| **长度** | 15% | 长度是否适中（150-400字符最佳） |

#### 3.6.3 评分等级

| 分数 | 等级 | 颜色 | 说明 |
|------|------|------|------|
| 4.5-5.0 | Excellent | 🟢 绿色 | 专业级Prompt，可直接使用 |
| 3.5-4.4 | Good | 🟡 黄色 | 良好，建议微调 |
| 2.5-3.4 | Average | 🟠 橙色 | 一般，需要优化 |
| 1.0-2.4 | Poor | 🔴 红色 | 较差，建议重写 |

---

### F15: 收藏Prompt

#### 3.7.1 功能描述
用户可以收藏喜欢的Prompt，建立个人Prompt库。

#### 3.7.2 用户故事
> 有些Prompt我特别喜欢，想保存下来以后反复用。收藏功能让我能快速找到这些"金牌Prompt"。

#### 3.7.3 收藏功能

```
┌─ My Collections ────────────────────────────────────────┐
│                                                          │
│  📁 My Collections (15 prompts)            [➕ New]   │
│                                                          │
│  ┌─ Collection: "Amazon Best" ─────────────────────────┐ │
│  │  8 prompts · Updated 2 days ago                      │ │
│  │                                                     │ │
│  │  ┌─ Prompt ──────────────────────────────────────┐  │ │
│  │  │  🎧 Wireless Earbuds - White Background        │  │ │
│  │  │  ★★★★★ (4.8) · Used 12 times                  │  │ │
│  │  │                                    [📋] [✏️] [🗑️]│  │ │
│  │  └────────────────────────────────────────────────┘  │ │
│  │                                                     │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌─ Collection: "Social Media" ────────────────────────┐ │
│  │  7 prompts · Updated 1 week ago                      │ │
│  │  ...                                                │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

### F16: 导出功能

#### 3.8.1 功能描述
将生成的Prompt导出为文件，支持CSV和TXT格式。

#### 3.8.2 导出格式

**CSV格式：**
```csv
Product Name,Platform,Type,Style,Prompt
Wireless Bluetooth Earbuds,Amazon,Electronics,White Background,"Professional product photography of..."
Wireless Bluetooth Earbuds,Amazon,Electronics,Lifestyle Scene,"Wireless Bluetooth Earbuds on modern..."
Wireless Bluetooth Earbuds,Amazon,Electronics,Detail Close-up,"Close-up macro shot of..."
```

**TXT格式：**
```
=====================================
Product: Wireless Bluetooth Earbuds
Platform: Amazon
Type: Electronics
=====================================

[White Background]
Professional product photography of...

[Lifestyle Scene]
Wireless Bluetooth Earbuds on modern...

[Detail Close-up]
Close-up macro shot of...
=====================================
```

---

## 四、第三期功能详细设计

---

### F17: API接口

#### 4.1.1 功能描述
提供REST API，允许第三方开发者调用Prompt生成服务。

#### 4.1.2 API规范

**Endpoint:** `POST /api/v1/generate`

**Request:**
```json
{
  "product_name": "Wireless Bluetooth Earbuds",
  "platform": "amazon",
  "product_type": "electronics",
  "styles": ["white", "lifestyle", "detail"],
  "api_key": "pp_live_xxxxxxxx"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "product_name": "Wireless Bluetooth Earbuds",
    "platform": "amazon",
    "product_type": "electronics",
    "prompts": [
      {
        "id": "white",
        "title": "White Background",
        "style": "white",
        "prompt": "Professional product photography of..."
      },
      {
        "id": "lifestyle",
        "title": "Lifestyle Scene",
        "style": "lifestyle",
        "prompt": "Wireless Bluetooth Earbuds on modern..."
      },
      {
        "id": "detail",
        "title": "Detail Close-up",
        "style": "detail",
        "prompt": "Close-up macro shot of..."
      }
    ]
  },
  "usage": {
    "quota_used": 1,
    "quota_remaining": 9999,
    "reset_date": "2026-06-01"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_PLATFORM",
    "message": "Platform 'alibaba' is not supported. Use: amazon, shopify, etsy, temu, ebay",
    "status": 400
  }
}
```

#### 4.1.3 限流策略

| 套餐 | 每月限额 | QPS限制 |
|------|---------|---------|
| Free | 100次 | 1 |
| Starter ($19) | 5,000次 | 5 |
| Pro ($49) | 20,000次 | 10 |
| Enterprise ($99) | 50,000次 | 20 |

---

### F18: 团队协作

#### 4.2.1 功能描述
支持团队共享Prompt库，多成员协作使用。

#### 4.2.2 角色权限

| 角色 | 权限 |
|------|------|
| **Owner** | 全部权限，可删除团队 |
| **Admin** | 管理成员、编辑共享库、查看统计 |
| **Editor** | 添加/编辑Prompt、查看共享库 |
| **Viewer** | 仅查看和复制Prompt |

#### 4.2.3 团队空间

```
┌─ Team: "MyStore Inc." ──────────────────────────────────┐
│                                                            │
│  Members: 5 · Shared Prompts: 45 · Usage this month: 1.2K │
│                                                            │
│  ┌─ Shared Library ────────────────────────────────────┐   │
│  │                                                     │   │
│  │  📁 Amazon Products (20 prompts)                   │   │
│  │  📁 Social Media Ads (15 prompts)                   │   │
│  │  📁 Seasonal Campaigns (10 prompts)                 │   │
│  │                                                     │   │
│  │  [➕ Add Folder]  [➕ Add Prompt]                    │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                            │
│  ┌─ Team Members ──────────────────────────────────────┐   │
│  │  👤 John (Owner)                                     │   │
│  │  👤 Sarah (Admin)                                    │   │
│  │  👤 Mike (Editor)                                    │   │
│  │  👤 Lisa (Viewer)                                    │   │
│  │  👤 Tom (Viewer)                                     │   │
│  │                                                     │   │
│  │  [➕ Invite Member]                                   │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                            │
│  ┌─ Usage Stats ───────────────────────────────────────┐   │
│  │  This Month: 1,245 prompts generated                 │   │
│  │  Top User: Sarah (423 prompts)                       │   │
│  │  Most Used: "White Background" style (45%)          │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

### F19: Prompt市场

#### 4.3.1 功能描述
用户可以在市场上分享或出售自己创建的Prompt模板。

#### 4.3.2 市场模式

| 模式 | 说明 | 抽成 |
|------|------|------|
| **免费分享** | 用户免费分享Prompt | 0% |
| **付费出售** | 用户定价出售Prompt | 平台抽成20% |
| **订阅制** | 创作者提供月度订阅 | 平台抽成30% |

#### 4.3.3 市场界面

```
┌─ Prompt Marketplace ──────────────────────────────────────┐
│                                                            │
│  🔍 Search prompts...        [Filter ▼]  [Sort ▼]        │
│                                                            │
│  ┌─ Featured Prompts ─────────────────────────────────┐   │
│  │                                                     │   │
│  │  ┌─ Card ─────────────────────────────────────────┐ │   │
│  │  │  🖼️ [Preview Image]                           │ │   │
│  │  │  📱 Amazon Electronics Prompt Pack              │ │   │
│  │  │  ⭐ 4.9 · 👤 2.3K downloads · 💰 $4.99         │ │   │
│  │  │  by @PromptMaster                              │ │   │
│  │  │                                    [Buy Now]   │ │   │
│  │  └────────────────────────────────────────────────┘ │   │
│  │                                                     │   │
│  │  ┌─ Card ─────────────────────────────────────────┐ │   │
│  │  │  🖼️ [Preview Image]                           │ │   │
│  │  │  💄 Beauty Product Prompts (Free)              │ │   │
│  │  │  ⭐ 4.7 · 👤 1.1K downloads · 💰 Free          │ │   │
│  │  │  by @BeautyGuru                                │ │   │
│  │  │                                    [Get Free]  │ │   │
│  │  └────────────────────────────────────────────────┘ │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                            │
│  [➕ Sell Your Prompts]                                   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

### F20: 一键生成图片

#### 4.4.1 功能描述
用户不仅能获得Prompt，还能直接调用AI图片生成API生成产品图。

#### 4.4.2 支持模型

| 模型 | 接入方式 | 成本 | 质量 |
|------|---------|------|------|
| **Midjourney** | 官方API | $$$ | ⭐⭐⭐⭐⭐ |
| **Flux** | Replicate/Fal.ai API | $$ | ⭐⭐⭐⭐⭐ |
| **DALL-E 3** | OpenAI API | $$ | ⭐⭐⭐⭐ |
| **Stable Diffusion** | Stability AI API | $ | ⭐⭐⭐ |

#### 4.4.3 生成流程

```
[用户操作]              [系统响应]
   │                        │
   ▼                        │
点击"Generate Image" ─────→  显示模型选择弹窗
   │                        │
   ▼                        │
选择Flux模型 ────────────→  显示生成进度（预计30秒）
   │                        │
   ▼                        │
等待生成 ─────────────────→  显示生成中的动画/进度条
   │                        │
   ▼                        │
生成完成 ─────────────────→  显示生成的4张图片缩略图
   │                        │
   ▼                        │
点击某张图片 ─────────────→  显示大图，提供下载按钮
```

#### 4.4.4 定价

| 套餐 | 图片生成额度 | 价格 |
|------|-------------|------|
| Free | 5张/月 | $0 |
| Pro | 100张/月 | 包含在$9.9中 |
| Enterprise | 500张/月 | 包含在$49中 |
| 按量 | $0.05/张 | 超出套餐后 |

---

## 五、通用设计规范

### 5.1 错误处理规范

#### 5.1.1 错误提示组件

```
┌─ Error Toast ───────────────────────────────────────────┐
│  ❌ Error: Product name is required                       │
│  Please enter a product name to generate prompts.       │
│                                          [Dismiss]      │
└─────────────────────────────────────────────────────────┘
```

#### 5.1.2 错误级别

| 级别 | 颜色 | 图标 | 使用场景 |
|------|------|------|---------|
| **Info** | 🔵 蓝色 | ℹ️ | 提示信息 |
| **Success** | 🟢 绿色 | ✅ | 操作成功 |
| **Warning** | 🟡 黄色 | ⚠️ | 警告但不阻断 |
| **Error** | 🔴 红色 | ❌ | 错误需处理 |

### 5.2 加载状态规范

#### 5.2.1 加载动画

**按钮加载：**
```
[🔄 Generating...]  ← 按钮内显示旋转图标+文字
```

**页面加载：**
```
┌─ Skeleton Loading ──────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────┐   │
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │   │
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │   │
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Generating your prompts... (2 seconds)                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 5.3 动画规范

#### 5.3.1 动画时长

| 动画类型 | 时长 | 缓动函数 |
|---------|------|---------|
| 按钮悬停 | 200ms | ease-out |
| 卡片入场 | 300ms | ease-out |
| 页面切换 | 400ms | ease-in-out |
| 加载旋转 | 1000ms | linear (循环) |
| 提示弹出 | 200ms | ease-out |
| 提示消失 | 150ms | ease-in |

#### 5.3.2 Framer Motion配置

```typescript
// 卡片入场动画
const cardAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: "easeOut" }
}

// 按钮悬停动画
const buttonHover = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.2 }
}

// 列表 stagger 动画
const listAnimation = {
  initial: "hidden",
  animate: "visible",
  variants: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }
}
```

### 5.4 埋点规范

#### 5.4.1 事件定义

```typescript
interface AnalyticsEvent {
  event: string;           // 事件名称
  timestamp: number;      // 时间戳
  userId?: string;        // 用户ID（如有）
  sessionId: string;      // 会话ID
  properties: {           // 事件属性
    [key: string]: any;
  }
}

// 事件列表
const EVENTS = {
  // 页面事件
  PAGE_VIEW: 'page_view',
  
  // 输入事件
  INPUT_FOCUS: 'input_focus',
  INPUT_CHANGE: 'input_change',
  
  // 生成事件
  GENERATE_CLICK: 'generate_click',
  GENERATE_SUCCESS: 'generate_success',
  GENERATE_ERROR: 'generate_error',
  
  // 复制事件
  COPY_PROMPT: 'copy_prompt',
  COPY_ALL: 'copy_all',
  
  // 选择事件
  SELECT_PLATFORM: 'select_platform',
  SELECT_TYPE: 'select_type',
  SELECT_STYLE: 'select_style',
  
  // 示例事件
  USE_EXAMPLE: 'use_example',
  
  // 编辑事件
  EDIT_PROMPT: 'edit_prompt',
  SAVE_EDIT: 'save_edit',
  
  // 历史事件
  VIEW_HISTORY: 'view_history',
  DELETE_HISTORY: 'delete_history',
  
  // 付费事件
  UPGRADE_CLICK: 'upgrade_click',
  CHECKOUT_START: 'checkout_start',
  CHECKOUT_SUCCESS: 'checkout_success',
  CHECKOUT_CANCEL: 'checkout_cancel',
  
  // 反馈事件
  FEEDBACK_SUBMIT: 'feedback_submit',
}
```

---

## 六、附录

### 6.1 术语表

| 术语 | 说明 |
|------|------|
| **Prompt** | 用于AI图像生成的文本描述 |
| **White Background** | 白底产品图风格 |
| **Lifestyle** | 场景氛围图风格 |
| **Detail** | 细节特写图风格 |
| **Platform** | 电商平台（Amazon/Shopify等） |
| **Type** | 产品品类（Electronics/Clothing等） |
| **KD** | Keyword Difficulty，关键词难度 |
| **CPC** | Cost Per Click，单次点击成本 |
| **CTR** | Click Through Rate，点击率 |
| **MRR** | Monthly Recurring Revenue，月度经常性收入 |

### 6.2 更新日志

| 版本 | 日期 | 更新内容 |
|------|------|---------|
| v1.0 | 2026-05-05 | 初始版本，定义三期规划 |
| v1.1 | 2026-05-05 | 补充详细功能设计、交互流程、边界情况 |

---

> **文档结束**  
> 如有疑问或需要调整，请联系产品经理。
