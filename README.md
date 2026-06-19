
# 🎮 Zalith Launcher 2 自定义主页

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-在线编辑器-blue?logo=github)](https://ssbtt114514.github.io/zalith-homepage/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![GitHub Actions](ssbtt114514)](https://github.com/ssbtt114514/zalith-homepage/actions)

全自动生成的自定义主页，支持多种数据源实时更新，并配有**可视化编辑器**，无需记忆语法即可创建漂亮的启动器主页。

---

## ✨ 功能特性

### 自动更新数据

| 功能 | 数据来源 | 更新频率 |
|------|---------|---------|
| 🖼️ Bing 每日壁纸 | Bing API | 每天 |
| 💬 每日一言 | Hitokoto API | 每次生成 |
| 📦 MC 版本信息 | Mojang 官方 API | 每天 |
| 🧩 Modrinth 最新模组 | Modrinth API | 每小时 |
| 🎮 服务器状态 | mcstatus.io | 每次生成 |
| 📖 Minecraft Wiki | Wiki API | 随机推荐 |

### 可视化编辑器

| 功能 | 说明 |
|------|------|
| 📦 卡片组件 | 带标题、圆角、内边距的容器 |
| 🔘 按钮组件 | 填充、边框、色调、文字 4 种样式 |
| 📐 布局组件 | 横向/纵向布局，支持权重分配 |
| 🖼️ 图片组件 | 可设置宽度和圆角 |
| 📝 排版组件 | 标题、引用块、列表、分割线 |
| 👁️ 实时预览 | 编辑即时预览效果 |
| 💾 文件操作 | 上传、下载、新建 MD 文件 |

---

## 🚀 快速开始

### 方式一：使用在线编辑器（推荐新手）

1. 访问在线编辑器：`https://ssbtt114514.github.io/zalith-homepage/`
2. 点击 **编辑** 按钮进入编辑模式
3. 点击组件按钮快速插入卡片、按钮、图片等
4. 编辑完成后点击 **下载** 保存文件
5. 将下载的 `home_page.md` 放入启动器的自定义主页目录

### 方式二：自动更新部署（推荐进阶）

#### 1. Fork 本仓库

点击 GitHub 右上角的 **Fork** 按钮。

#### 2. 启用 GitHub Actions

仓库会自动每天 8:00、12:00、20:00 运行更新脚本。

#### 3. 配置环境变量（可选）

在仓库 Settings → Secrets and variables → Actions 中添加：

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `SERVER_IP` | MC 服务器 IP | `play.mcmod.cn` |

#### 4. 配置启动器

在 Zalith Launcher 2 的自定义主页设置中填入：

```

https://raw.githubusercontent.com/你的用户名/ZalithLauncher2_home_page/main/home_page.md

```

---

## 📁 文件结构

```

zalith-homepage/
├── index.html                 # 可视化编辑器
├── home_page.md               # 生成的自定义主页（自动更新）
├── README.md                  # 本文件
├── css/
│   └── style.css              # 编辑器样式
├── js/
│   ├── main.js                # 主入口
│   ├── renderer.js            # Markdown 渲染器
│   ├── components.js          # 组件模板库
│   ├── fileHandler.js         # 文件操作
│   └── ui.js                  # UI 交互
├── scripts/
│   └── update.js              # 自动更新脚本
└── .github/workflows/
└── update-homepage.yml    # GitHub Actions 工作流

```

---

## 🔧 自定义配置

### 修改自动更新内容

编辑 `scripts/update.js` 中的配置：

```javascript
// 配置文件 config.json（可选）
{
    "qqGroup": "123456789",
    "authorUrl": "https://ssbtt114514.github.io/",
    "authorName": "ssbtt114514"
}
```

修改编辑器组件

编辑 js/components.js 中的 ComponentTemplates 对象：

```javascript
// 添加自定义组件
myComponent: {
    name: '我的组件',
    fields: [...],
    template: (data) => `...my-component ${data.attr}`
}
```

修改预览样式

编辑 css/style.css 中的自定义组件样式：

```css
/* 修改卡片样式 */
.custom-card {
    background: #你的颜色;
    border-radius: 你的圆角;
}
```

---

⚙️ GitHub Actions 配置

工作流已配置为每天 北京时间 8:00、12:00、20:00 自动运行。

手动触发

1. 进入仓库 Actions 页面
2. 选择 "更新 Zalith Launcher 主页"
3. 点击 "Run workflow"

工作流文件

```yaml
# .github/workflows/update-homepage.yml
name: 更新 Zalith Launcher 主页

on:
  schedule:
    - cron: '0 0,4,12 * * *'  # UTC 时间，对应北京时间 8:00, 12:00, 20:00
  workflow_dispatch:           # 支持手动触发

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install axios
      - run: node scripts/update.js
        env:
          SERVER_IP: ${{ secrets.SERVER_IP }}
      - uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: 'chore: 自动更新主页'
          branch: main
```

---

📝 Zalith 扩展组件语法速查

卡片组件

```markdown
...card-start title="我的卡片" shape=medium contentPadding=(16,12)
这里是卡片内容，支持 **Markdown**
...card-end
```

按钮组件（4种样式）

```markdown
...button text="填充按钮" event="url {https://example.com}"
...button-outlined text="边框按钮" event="check_update"
...button-filled-tonal text="色调按钮" event="launch_game"
...button-text text="文字按钮" event="copy {文本}"
```

布局组件

```markdown
...row-start horizontal=spacedBy(8) vertical=Center
    ...button text="按钮1" weight=(1)
    ...button text="按钮2" weight=(1)
...row-end

...column-start vertical=spacedBy(8) horizontal=Center
    ...button text="按钮1"
    ...button text="按钮2"
...column-end
```

图片组件

```markdown
...image url="https://picsum.photos/400" width=50% shape=12dp
```

支持的事件类型

事件 说明
event="url {https://...}" 在浏览器中打开链接
event="copy{文本}" 复制文本到剪贴板
event="launch_game" 启动当前选中的游戏版本
event="check_update" 检查启动器更新

圆角大小选项

预设值 说明
extraSmall 4px
small 8px
medium 12px（默认）
large 16px
extraLarge 24px
12dp 自定义像素值
20% 百分比圆角

---

❓ 常见问题

Q: 如何让卡片不显示标题栏？

A: 省略 title 属性即可：...card-start shape=medium

Q: 如何让按钮在 Row 中平均分布？

A: 给每个按钮添加 weight=(1) 属性

Q: 图片加载失败怎么办？

A: 编辑器会自动显示占位图，启动器中请确保图片链接可访问

Q: 如何自定义更新频率？

A: 修改 .github/workflows/update-homepage.yml 中的 cron 表达式

Q: 卡片可以放在 Row/Column 里面吗？

A: ❌ 不可以！教程明确规定卡片组件不能被装进布局组件中

---

🔗 相关链接

· Zalith Launcher 2 官方文档
· Markdown 教程
· Modrinth API 文档
· Hitokoto 一言 API
· Minecraft Wiki

---

📄 许可证

MIT License

---

👤 作者

ssbtt114514

· GitHub: @ssbtt114514
· 个人主页: https://ssbtt114514.github.io/

---

🌟 支持项目

如果这个项目对你有帮助，请给原作者的仓库一个 Star ⭐

https://api.star-history.com/svg?repos=ssbtt114514/zalith-homepage&type=Date

```

---

## 📁 更新后的文件结构

```

zalith-homepage/
├── index.html                 # 可视化编辑器
├── home_page.md               # 生成的自定义主页
├── README.md                  # 本文件（已更新）
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── renderer.js
│   ├── components.js
│   ├── fileHandler.js
│   └── ui.js
├── scripts/
│   └── update.js
└── .github/workflows/
└── update-homepage.yml

```

---

## ✅ README 更新内容

| 新增内容 | 说明 |
|----------|------|
| 可视化编辑器功能表 | 列出编辑器的所有功能 |
| 在线编辑器使用教程 | 新手友好的操作步骤 |
| 文件结构更新 | 反映实际的目录结构 |
| 扩展组件语法速查 | 完整的组件语法参考 |
| 圆角大小选项表 | 清晰列出所有圆角预设 |
| 常见问题 FAQ | 解答常见疑问 |
| 作者信息 | 包含个人主页链接 |