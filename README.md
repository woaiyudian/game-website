# 模拟人生・微力版 官方网站

一个纯静态的游戏官网，深色简约风格。包含首页和程序仓库两个页面。

---

## 一、怎么启动

1. 双击 **`启动.bat`**
2. 浏览器会自动打开 `http://localhost:8080`

> 关闭启动窗口 = 停止服务。
> 本机重启后再玩：再双击一次 `启动.bat` 即可。

## 二、页面说明

| 页面 | 路径 | 说明 |
|------|------|------|
| 首页 | `/` 或 `/index.html` | 游戏介绍、截图展示、开发动态 |
| 程序仓库 | `/repo.html` | 所有程序下载列表 |

## 三、文件结构

```
game-website/
├── backend/
│   └── server.js          # Node 静态文件服务器（零依赖）
├── public/
│   ├── index.html         # 首页
│   ├── repo.html          # 程序仓库页
│   └── style.css          # 样式文件
├── redirect/
│   └── index.html         # GitHub Pages 跳转页模板
├── package.json           # npm 配置
├── render.yaml            # Render 云端部署配置
├── 启动.bat               # 双击启动（推荐）
├── start.ps1              # PowerShell 启动脚本
├── auto-guard.ps1         # 全自动守护（内网穿透 + GitHub 跳转页）
├── .gitignore             # Git 忽略文件
├── README.md              # 本文件
└── README-云端部署.md     # Render 部署说明
```

## 四、修改方法

- **改文字/内容**：编辑 `public/index.html` 或 `public/repo.html`
- **改样式/颜色**：编辑 `public/style.css`（顶部 `:root` 里是颜色变量，改一处全局生效）
- **加新程序**：复制 `public/repo.html` 里的卡片模板，改名称、版本、介绍、下载链接
- **改端口**：编辑 `backend/server.js` 顶部的 `PORT` 默认值

## 五、让别人也能访问

### 方式一：内网穿透 + GitHub Pages（和代理后台一样）

运行 `auto-guard.ps1`，自动启动隧道并更新 GitHub Pages 跳转页。
别人通过固定的 GitHub Pages 地址就能访问，隧道地址变了自动同步。

### 方式二：Render 云端部署（永久在线）

详见 [README-云端部署.md](README-云端部署.md)

## 六、技术信息

- 后端：`backend/server.js`（Node 内置 http 模块，零依赖）
- 前端：`public/` 纯 HTML + CSS
- 默认端口：8080（可在 `backend/server.js` 顶部修改）
