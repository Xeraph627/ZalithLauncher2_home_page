// ============================================
// 🎮 Zalith Launcher 2 - 全自动更新主页
// 生成时间：2026-05-12 14:42:26
// 数据来源：Bing | 一言 | Mojang | Modrinth | Minecraft Wiki
// ============================================

// --- Bing 每日壁纸横幅 ---
...image url="https://cn.bing.com/th?id=OHR.Fratercula_ZH-CN1239275412_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp" width=100% shape=0dp

// --- 每日一言 ---
...card-start title="📜 每日一言" shape=large contentPadding=(16,12)
    ...column-start vertical=spacedBy(8) horizontal=Center
> *"大丈夫立世无所畏惧。"*

        ...row-start horizontal=spacedBy(12)
            ...button-text text="📋 复制" event="copy{大丈夫立世无所畏惧。}"
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
            ...button-filled-tonal text="📖 Minecraft Wiki" event="url{https://minecraft.wiki/Bedrock_Edition_block_render_history%2FBamboo_Shoot}" weight=(1)
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
            ...image url="https://cdn.modrinth.com/data/EdYzKX4V/3e5e92f7b861998dbb4ae93d49799dcdea7b0fb3.png" width=32dp shape=4dp
            ...column-start
                ...button-text text="Visual Ping" event="url{https://modrinth.com/mod/visualping}"
                <span style="font-size:12px; color:#94a3b8;">📥 0.0M | 👤 haiderlovestostudy | 📅 2026-05-12</span>
                <span style="font-size:12px;">Displays the player's numerical ping in the tablist</span>
            ...column-end
        ...row-end

        ...row-start horizontal=spacedBy(8) vertical=Center
            ...image url="https://cdn.modrinth.com/data/7lhLLKcs/eb45b4c808568c2237193808713e1311236e635d_96.webp" width=32dp shape=4dp
            ...column-start
                ...button-text text="Neo Hammers" event="url{https://modrinth.com/mod/neo-hammers}"
                <span style="font-size:12px; color:#94a3b8;">📥 0.0M | 👤 __Comma | 📅 2026-05-12</span>
                <span style="font-size:12px;">Adds hammers that let you mine large areas in no time!</span>
            ...column-end
        ...row-end

        ...row-start horizontal=spacedBy(8) vertical=Center
            ...image url="https://cdn.modrinth.com/data/WXA03JUt/e068fdfc20e4dbd41cea35df5e40b2dcaa0e4294_96.webp" width=32dp shape=4dp
            ...column-start
                ...button-text text="Ecliptic Seasons: Fabricated" event="url{https://modrinth.com/mod/ecliptic-seasons-fabricated}"
                <span style="font-size:12px; color:#94a3b8;">📥 0.0M | 👤 joe-vettek | 📅 2026-05-12</span>
                <span style="font-size:12px;">A native, lightweight rewrite of Ecliptic Seasons for Fabric, delivering a high-</span>
            ...column-end
        ...row-end

        ...row-start horizontal=spacedBy(8) vertical=Center
            ...image url="https://cdn.modrinth.com/data/842fDzwq/0b1c26166610220d957b443495beedc526d79b8b_96.webp" width=32dp shape=4dp
            ...column-start
                ...button-text text="SmartLootFilter" event="url{https://modrinth.com/mod/smartlootfilter}"
                <span style="font-size:12px; color:#94a3b8;">📥 0.0M | 👤 Awidex | 📅 2026-05-12</span>
                <span style="font-size:12px;">Take control of your inventory in Minecraft 1.21.11! Smart Loot Filter lets you </span>
            ...column-end
        ...row-end

        ...row-start horizontal=spacedBy(8) vertical=Center
            ...image url="https://cdn.modrinth.com/data/NkhZnHWj/8060d2dd1d919096212cccc8d45961d145ed98ac_96.webp" width=32dp shape=4dp
            ...column-start
                ...button-text text="AI Builder - Minecraft AI Assistant" event="url{https://modrinth.com/mod/ai-builder-minecraft-ai-assistant}"
                <span style="font-size:12px; color:#94a3b8;">📥 0.0M | 👤 liuzeen1234 | 📅 2026-05-12</span>
                <span style="font-size:12px;">In-game AI assistant mod with natural language chat, AI-powered building, NBT/bl</span>
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

📖 **Wiki 推荐**：[Bedrock Edition block render history/Bamboo Shoot](https://minecraft.wiki/Bedrock_Edition_block_render_history%2FBamboo_Shoot)

⏰ 更新时间：2026-05-12 14:42:26

        ...row-start horizontal=spacedBy(12)
            ...button-text text="📖 Markdown教程" event="url{https://www.runoob.com/markdown/md-tutorial.html}"
            ...button-text text="🐙 项目源码" event="url{https://github.com/}"
        ...row-end
    ...column-end
...card-end
