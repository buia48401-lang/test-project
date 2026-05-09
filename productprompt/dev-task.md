# 开发任务：ProductPrompt.ai 第二期 - 第一批P0核心功能

需要实现3个功能：F09历史记录、F10 Prompt编辑、F11 AI优化建议

## 项目背景
- Next.js 15 + React 19 + TypeScript + Tailwind CSS + Framer Motion
- 静态导出（output: 'export'）
- 当前已有：产品名输入、平台选择、品类选择、生成3-4种风格Prompt、一键复制

## 当前文件结构
- app/page.tsx - 主页面（约610行）
- lib/promptGenerator.ts - Prompt生成引擎
- lib/utils.ts - 工具函数

## 功能1：F09 历史记录

### 需求
- 保存用户最近生成的Prompt记录到localStorage
- 最大保存20条，满后删除最旧的
- 支持查看、复制、删除单条记录
- 按时间分组显示（Today/Yesterday/Earlier）
- 在页面顶部增加History按钮，点击展开侧边栏/抽屉

### 数据模型
interface HistoryItem {
  id: string;                    // UUID
  productName: string;
  platform: string;
  productType: string;
  prompts: PromptResult[];
  createdAt: number;             // 时间戳
  copiedCount: number;          // 被复制次数
}

### localStorage设计
- Key: productprompt_history
- Value: JSON字符串
- 最大20条

### UI设计
- 页面Header右侧增加"History"按钮（时钟图标）
- 点击后从右侧滑出抽屉（Drawer）
- 抽屉内显示历史列表，按时间分组
- 每条历史显示：产品名、平台、品类、生成时间、复制次数
- 支持点击展开查看3-4个Prompt
- 支持单条删除和全部清空

## 功能2：F10 Prompt编辑

### 需求
- 用户在生成的Prompt卡片上点击"Edit"按钮，进入编辑模式
- 可自由修改Prompt文本
- 实时显示字符计数（当前/最大500）
- 支持一键恢复原始Prompt
- 保存编辑后的Prompt到历史记录

### UI设计
- 在Prompt卡片的Copy按钮旁边增加Edit按钮（铅笔图标）
- 点击后展开文本编辑区域（Textarea）
- 显示原始Prompt和编辑后的Prompt对比
- 底部显示字符计数和操作按钮（Save/Cancel/Reset）

## 功能3：F11 AI优化建议

### 需求
- 基于规则引擎（免费，无需API）
- 分析生成的Prompt，给出优化建议
- 建议类型：添加关键词、删除关键词、替换关键词、结构调整、平台适配

### 规则引擎设计
interface SuggestionRule {
  id: string;
  check: (prompt: string, platform: string) => boolean;
  message: string;
  impact: string;
}

### 预设规则
1. 如果Prompt没有"bokeh"或"blur"，建议添加"bokeh background"（+15% CTR）
2. 如果Prompt同时包含"8k"和"highly detailed"，建议删除"8k"（节省token）
3. 如果平台是Amazon但没有"fill frame"，建议添加（符合平台规范）
4. 如果Prompt没有背景描述，建议添加背景
5. 如果产品名不在Prompt前20%位置，建议调整结构

### UI设计
- 在Prompt卡片下方显示"AI Suggestions"区域
- 每条建议显示：建议内容 + 影响（如"+15% CTR"）
- 提供"Apply"按钮一键应用建议
- 最多显示3条建议

## 技术要求
1. 所有新功能使用TypeScript，类型安全
2. 使用Tailwind CSS样式
3. 使用Framer Motion动画（抽屉滑入、展开/收起）
4. 使用Lucide React图标
5. 保持静态导出兼容（不使用服务端API）
6. 不要破坏现有功能

## 开发顺序
1. 先实现F09历史记录（基础功能）
2. 再实现F10 Prompt编辑（依赖历史记录）
3. 最后实现F11 AI优化建议（独立功能）

请读取当前代码文件，分析结构，然后按顺序实现这3个功能。确保代码质量和一致性。
