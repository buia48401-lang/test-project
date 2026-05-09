# 开发环境工作流文档

> 记录服务器开发环境配置、工具链、项目规范和工作流程
> 最后更新：2026-05-09

---

## 服务器环境

| 项目 | 值 |
|------|-----|
| 机器 | VM-0-16-ubuntu |
| 项目根目录 | `/project`（所有项目必须放这里） |
| Node.js | v22.22.2 |
| npm | 10.9.7 |
| Git | 2.43.0 |

---

## Git 配置

| 项目 | 值 |
|------|-----|
| 用户名 | fan Chen |
| 邮箱 | buia48401@gmail.com |
| GitHub 账号 | buia48401-lang |
| 连接方式 | SSH（密钥已配置到 GitHub） |
| 凭证存储 | `~/.ssh/id_ed25519` |

### 常用 Git 命令
```bash
git add . && git commit -m "feat: xxx" && git push
git status
git log --oneline
```

---

## Claude Code 配置

| 项目 | 值 |
|------|-----|
| 版本 | 2.1.138 |
| 安装路径 | `/usr/bin/claude` |
| 模型 | Kimi Code（通过 Anthropic API 兼容层） |
| API Base URL | `https://api.kimi.com/coding/` |
| 凭证文件 | `~/.claude/.credentials.json` |
| 自动执行配置 | `~/.claude/settings.json` |

### 环境变量（已写入 `~/.bashrc`）
```bash
export ANTHROPIC_BASE_URL="https://api.kimi.com/coding/"
export ANTHROPIC_API_KEY="sk-kimi-..."
```

### 自动执行配置
`~/.claude/settings.json`:
```json
{
  "permissions": {
    "autoAccept": true,
    "allowedTools": ["Bash", "Edit", "Read", "Write", "Glob", "Grep", "LS", "View", "Fetch", "WebFetch"]
  }
}
```

---

## gh CLI 配置

| 项目 | 值 |
|------|-----|
| 版本 | 2.92.0 |
| 认证方式 | GitHub Token |
| 配置文件 | `~/.config/gh/hosts.yml` |

### 常用 gh 命令
```bash
gh auth status          # 查看登录状态
gh repo create          # 创建仓库
gh repo list            # 列出仓库
gh pr create            # 创建 PR
```

---

## 开发工作流规则

### 1. 项目目录规范
- **所有项目必须放在 `/project` 目录下**
- 禁止在根目录或其他位置创建项目

### 2. Claude Code 使用规范
- **开发必须用交互模式**：`claude`
- **禁止用 print 模式开发**：`claude -p`（仅用于分析、审查等一次性任务）
- **每次必须继续上次会话**：`claude --continue` 或 `claude -c`
- **直到开发完成后再提交代码**

### 3. 会话管理
```bash
# Session 1: 开始开发
cd /project/your-project
claude
"帮我开发 xxx 功能"
# ... 开发中 ...
/exit

# Session 2: 继续开发（必须！）
cd /project/your-project
claude --continue
"继续完善，添加 yyy 功能"
# ... 开发中 ...
/exit

# Session 3: 收尾
cd /project/your-project
claude --continue
"优化代码，添加测试"
# ... 完成 ...
/exit
```

### 4. 代码提交规范
```bash
# 开发完成后
git add .
git commit -m "feat: 描述信息"
git push

# 提交信息格式
# feat: 新功能
# fix: 修复问题
# refactor: 重构
# docs: 文档
# test: 测试
```

### 5. 快捷键
| 快捷键 | 作用 |
|--------|------|
| `Alt+T` | 开启/关闭 Thinking 模式 |
| `/status` | 查看当前状态 |
| `/config` | 打开配置 |
| `/clear` | 清空对话 |
| `/exit` | 退出会话 |

---

## 已创建项目

### test-project
- **路径**: `/project/test`
- **GitHub**: https://github.com/buia48401-lang/test-project
- **技术栈**: TypeScript + Express + Vitest + ESLint + Prettier
- **状态**: 已初始化，包含基础架构

---

## 常用命令速查

### 项目开发
```bash
cd /project/your-project
npm install       # 安装依赖
npm run dev       # 开发模式（热重载）
npm run build     # 构建
npm test          # 运行测试
npm run lint      # ESLint 检查
npm run format    # Prettier 格式化
```

### Claude Code
```bash
claude              # 启动交互模式（开发用）
claude --continue   # 继续上次会话（开发用）
claude -c           # 同上
claude -p "任务"    # 非交互模式（仅分析/审查）
claude --new        # 强制新会话
```

### Git + GitHub
```bash
git add . && git commit -m "feat: xxx" && git push
gh repo create repo-name --public --source=. --remote=origin --push
```

---

## 故障排除

| 问题 | 解决方案 |
|------|----------|
| `Invalid API key` | 检查 `echo $ANTHROPIC_API_KEY` |
| `Permission denied` | 检查 `~/.claude/` 目录权限 |
| 自动执行不工作 | 检查 `~/.claude/settings.json` 的 `autoAccept` |
| 会话无法恢复 | 确保在项目目录内执行 `claude --continue` |
| Git push 失败 | 检查 `ssh -T git@github.com` |
| gh 未认证 | 执行 `gh auth status` 检查 |

---

## 待添加记录

- [ ] 更多项目模板
- [ ] CI/CD 配置
- [ ] Docker 配置
- [ ] 数据库配置
- [ ] 前端项目模板
- [ ] 部署流程
- [ ] 监控和日志

---

*本文档持续更新，每次新配置或流程变更都应记录于此。*
