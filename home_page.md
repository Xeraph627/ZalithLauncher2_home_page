// ============================================
// 🎮 Zalith Launcher 2 - 全自动更新主页
// 生成时间：2026-05-15 04:08:13
// 数据来源：Bing | 一言 | Mojang | Modrinth | Minecraft Wiki
// ============================================

// --- Bing 每日壁纸横幅 ---
...image url="https://cn.bing.com/th?id=OHR.EndangeredWhales_ZH-CN4053106967_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp" width=100% shape=0dp

// --- 每日一言 ---
...card-start title="📜 每日一言" shape=large contentPadding=(16,12)
    ...column-start vertical=spacedBy(8) horizontal=Center
> *"你总说我不好，可我对你的好，你却从来不记得。"*

        ...row-start horizontal=spacedBy(12)
            ...button-text text="📋 复制" event="copy{你总说我不好，可我对你的好，你却从来不记得。}"
        ...row-end
    ...column-end
...card-end



// --- ⚡ 快捷操作 ---
...card-start title="🚀 快捷操作" shape=medium contentPadding=(12)
    ...row-start horizontal=spacedBy(12) vertical=Center
        ...button text="▶️ 启动游戏" event="launch_game" weight=(1)
        ...button-outlined text="🔄 检查更新" event="check_update" weight=(1)
    ...row-end
...card-end

// --- 📦 MC 版本信息 ---
...card-start title="📦 Minecraft 版本" shape=medium contentPadding=(12)
    ...column-start vertical=spacedBy(6) horizontal=Start
**最新正式版**: 26.1.2
**最新快照**: 26.2-snapshot-7

近期版本：
        - **26.1.2** (2026-04-09)
        - **26.1.1** (2026-04-01)
        - **26.1** (2026-03-24)

        ...row-start horizontal=spacedBy(8)
            ...button text="📥 官方下载" event="url{https://www.minecraft.net/zh-hans/download}" weight=(1)
            ...button text="📋 复制版本号" event="copy{26.1.2}" weight=(1)
        ...row-end
    ...column-end
...card-end

// --- 🌐 MC 资源中心 ---
...card-start title="📚 MC 资源中心" shape=medium contentPadding=(12)
    ...column-start vertical=spacedBy(8) horizontal=Center
        ...row-start horizontal=spacedBy(8)
            ...button-filled-tonal text="📖 MC百科" event="url{https://www.mcmod.cn/}" weight=(1)
            ...button-filled-tonal text="🔍 模组列表" event="url{https://www.mcmod.cn/modlist.html}" weight=(1)
        ...row-end
        ...row-start horizontal=spacedBy(8)
            ...button-filled-tonal text="📖 Minecraft Wiki" event="url{https://minecraft.wiki/Bedrock_Edition_block_render_history%2FSniffer_Egg}" weight=(1)
            ...button text="🌐 CurseForge" event="url{https://www.curseforge.com/minecraft/mcmods}" weight=(1)
        ...row-end
        ...row-start horizontal=spacedBy(8)
            ...button text="🌐 Modrinth" event="url{https://modrinth.com/mods}" weight=(1)
        ...row-end
    ...column-end
...card-end

// --- 🧩 Modrinth 最新模组 ---
...card-start title="🧩 Modrinth 最新模组" shape=medium contentPadding=(12)
    ...column-start vertical=spacedBy(12) horizontal=Start
        ...row-start horizontal=spacedBy(8) vertical=Center
            ...image url="https://cdn.modrinth.com/data/4FSfWZJs/ebbdd8e80ef50cb62e6c88f7d137abcba6b581f0_96.webp" width=32dp shape=4dp
            ...column-start
                ...button-text text="TNT Logic - Realistic Explosion Physics" event="url{https://modrinth.com/mod/tnt-logic-realistic-explosion-physics}"
                <span style="font-size:12px; color:#94a3b8;">📥 0.0M | 👤 EroZeq | 📅 2026-05-15</span>
                <span style="font-size:12px;">Explosions now trigger realistic, block-by-block structural collapses. Watch ent</span>
            ...column-end
        ...row-end

        ...row-start horizontal=spacedBy(8) vertical=Center
            ...image url="https://cdn.modrinth.com/data/pTo5D70F/f609465fadd512d74a52fb81f2f779a2d96c04bf_96.webp" width=32dp shape=4dp
            ...column-start
                ...button-text text="Macrorecorder/player" event="url{https://modrinth.com/mod/macrorecorderplayer}"
                <span style="font-size:12px; color:#94a3b8;">📥 0.0M | 👤 derkrankesenator | 📅 2026-05-15</span>
                <span style="font-size:12px;">A simple Macrorecorder for servers/clients</span>
            ...column-end
        ...row-end

        ...row-start horizontal=spacedBy(8) vertical=Center
            ...image url="https://cdn.modrinth.com/data/XEx3R6OZ/icon.png" width=32dp shape=4dp
            ...column-start
                ...button-text text="NoGhostHit" event="url{https://modrinth.com/mod/noghosthit}"
                <span style="font-size:12px; color:#94a3b8;">📥 0.0M | 👤 TxZed__ | 📅 2026-05-15</span>
                <span style="font-size:12px;">This is made special for boxpvp players.</span>
            ...column-end
        ...row-end

        ...row-start horizontal=spacedBy(8) vertical=Center
            ...image url="https://cdn.modrinth.com/data/rFmXytEC/49d915043407ad32411e70ffb19212ecec6ebcb3_96.webp" width=32dp shape=4dp
            ...column-start
                ...button-text text="Helm" event="url{https://modrinth.com/mod/helm}"
                <span style="font-size:12px; color:#94a3b8;">📥 0.0M | 👤 Noslow | 📅 2026-05-15</span>
                <span style="font-size:12px;">Reduces world loading time by preloading world data in the background</span>
            ...column-end
        ...row-end

        ...row-start horizontal=spacedBy(8) vertical=Center
            ...image url="https://cdn.modrinth.com/data/Cfyw5WXC/2b519ed7e681514b4924d92ec88a49af491a8de1_96.webp" width=32dp shape=4dp
            ...column-start
                ...button-text text="FPS Benchmark" event="url{https://modrinth.com/mod/fps-benchmark}"
                <span style="font-size:12px; color:#94a3b8;">📥 0.0M | 👤 randomfinder | 📅 2026-05-15</span>
                <span style="font-size:12px;">Cinematic auto-benchmark for Minecraft. One-click Base run is built for everyone</span>
            ...column-end
        ...row-end

        ...row-start horizontal=spacedBy(8)
            ...button text="📥 访问 Modrinth" event="url{https://modrinth.com/mods}" weight=(1)
        ...row-end
    ...column-end
...card-end

// --- 🛠️ 实用工具 ---
...card-start title="🧰 实用工具" shape=medium contentPadding=(12)
    ...column-start vertical=spacedBy(8) horizontal=Center
        ...button-outlined text="📋 复制QQ群" event="copy{123456789}" width=50%
    ...column-end
...card-end

// --- 📸 精选壁纸 ---
...card-start title="🎨 更多壁纸" shape=medium contentPadding=(12)
    ...row-start horizontal=spacedBy(8) vertical=Center
        ...image url="https://api.bimg.cc/random?resolution=1920x1080&index=1" width=30% shape=8dp weight=(1)
        ...image url="https://api.bimg.cc/random?resolution=1920x1080&index=2" width=30% shape=8dp weight=(1)
        ...image url="https://api.bimg.cc/random?resolution=1920x1080&index=3" width=30% shape=8dp weight=(1)
    ...row-end
...card-end

// --- ℹ️ 关于 ---
...card-start title="ℹ️ 关于" shape=small contentPadding=(12)
    ...column-start vertical=spacedBy(4) horizontal=Center
**Zalith Launcher 2** 自动更新主页

🖼️ 壁纸：鲸鱼，你会救我吗？
        © 一群抹香鲸, 印度洋 (© Tony Wu/Nature Picture Library)

👤 **作者**：[ssbtt114514](https://ssbtt114514.github.io/)

📖 **Wiki 推荐**：[Bedrock Edition block render history/Sniffer Egg](https://minecraft.wiki/Bedrock_Edition_block_render_history%2FSniffer_Egg)

⏰ 更新时间：2026-05-15 04:08:13

        ...row-start horizontal=spacedBy(12)
            ...button-text text="📖 Markdown教程" event="url{https://www.runoob.com/markdown/md-tutorial.html}"
            ...button-text text="🐙 项目源码" event="url{https://github.com/}"
        ...row-end
    ...column-end
...card-end
