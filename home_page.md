// ============================================
// 🎮 Zalith Launcher 2 - 全自动更新主页
// 生成时间：2026-05-12 03:56:01
// 数据来源：Bing | 一言 | Mojang | Modrinth | Minecraft Wiki
// ============================================

// --- Bing 每日壁纸横幅 ---
...image url="https://cn.bing.com/th?id=OHR.Fratercula_ZH-CN1239275412_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp" width=100% shape=0dp

// --- 每日一言 ---
...card-start title="📜 每日一言" shape=large contentPadding=(16,12)
    ...column-start vertical=spacedBy(8) horizontal=Center
> *"是非在己，毁誉由人，得失不论。"*

        ...row-start horizontal=spacedBy(12)
            ...button-text text="📋 复制" event="copy{是非在己，毁誉由人，得失不论。}"
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
**最新快照**: 26.2-snapshot-6

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
            ...button-filled-tonal text="📖 Minecraft Wiki" event="url{https://minecraft.wiki/Bedrock_Edition_beta_1.16.0.57}" weight=(1)
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
            ...image url="https://cdn.modrinth.com/data/xeV7e9OJ/cc21549eff1fc73fb16ee4f6577f3c7d4c2e2924_96.webp" width=32dp shape=4dp
            ...column-start
                ...button-text text="Ely4Everyone" event="url{https://modrinth.com/mod/ely4everyone}"
                <span style="font-size:12px; color:#94a3b8;">📥 0.0M | 👤 Cokeef | 📅 2026-05-12</span>
                <span style="font-size:12px;">Quality of life ely.by mode🏴‍☠️</span>
            ...column-end
        ...row-end

        ...row-start horizontal=spacedBy(8) vertical=Center
            ...image url="https://cdn.modrinth.com/data/c50G8Ta5/55f5be768e31b6f0d26e4ac9de1247f2cc51764a_96.webp" width=32dp shape=4dp
            ...column-start
                ...button-text text="Durability Minus" event="url{https://modrinth.com/mod/durability-minus}"
                <span style="font-size:12px; color:#94a3b8;">📥 0.0M | 👤 SG143s | 📅 2026-05-12</span>
                <span style="font-size:12px;">A simple mod that adds declining equipment performance based on durability</span>
            ...column-end
        ...row-end

        ...row-start horizontal=spacedBy(8) vertical=Center
            ...image url="https://cdn.modrinth.com/data/fbEpSgMk/8fff7c218069b05c7a614e1db110ec1c79f8cdc8.png" width=32dp shape=4dp
            ...column-start
                ...button-text text="McDonalds Meals" event="url{https://modrinth.com/mod/mcdonalds-meals}"
                <span style="font-size:12px; color:#94a3b8;">📥 0.0M | 👤 BeaconGames | 📅 2026-05-12</span>
                <span style="font-size:12px;">This mod adds Mcdonalds! I hope you enjoy!</span>
            ...column-end
        ...row-end

        ...row-start horizontal=spacedBy(8) vertical=Center
            ...image url="https://cdn.modrinth.com/data/3M4quKQ4/99d51a4fa42734946ae11ea3eeda8690da120e64.png" width=32dp shape=4dp
            ...column-start
                ...button-text text="All aggressive" event="url{https://modrinth.com/mod/all-aggressive}"
                <span style="font-size:12px; color:#94a3b8;">📥 0.0M | 👤 shugatel | 📅 2026-05-12</span>
                <span style="font-size:12px;">This is a survival mod that turns every mob in Minecraft into a deadly threat. E</span>
            ...column-end
        ...row-end

        ...row-start horizontal=spacedBy(8) vertical=Center
            ...image url="https://cdn.modrinth.com/data/dNLZ9VjB/bde5699e3b3e477cbce4c806c547866324509e63_96.webp" width=32dp shape=4dp
            ...column-start
                ...button-text text="Xaeros playerposition" event="url{https://modrinth.com/mod/xaeros-playerposition}"
                <span style="font-size:12px; color:#94a3b8;">📥 0.0M | 👤 liyueovo | 📅 2026-05-12</span>
                <span style="font-size:12px;">Xaero 小地图/世界地图附加mod，在地图中显示玩家具体位置，方便寻找 Xaero minimap/World map additional mod, sh</span>
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

🖼️ 壁纸：振翅, 潜水, 生存
        © 北极海鹦, 威尔士 (© FLPA/Alamy)

👤 **作者**：[ssbtt114514](https://ssbtt114514.github.io/)

📖 **Wiki 推荐**：[Bedrock Edition beta 1.16.0.57](https://minecraft.wiki/Bedrock_Edition_beta_1.16.0.57)

⏰ 更新时间：2026-05-12 03:56:01

        ...row-start horizontal=spacedBy(12)
            ...button-text text="📖 Markdown教程" event="url{https://www.runoob.com/markdown/md-tutorial.html}"
            ...button-text text="🐙 项目源码" event="url{https://github.com/}"
        ...row-end
    ...column-end
...card-end
