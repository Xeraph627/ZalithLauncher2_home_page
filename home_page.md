// ============================================
// 🎮 Zalith Launcher 2 - 全自动更新主页
// 生成时间：2026-05-12 06:43:19
// 数据来源：Bing | 一言 | Mojang | Modrinth | Minecraft Wiki
// ============================================

// --- Bing 每日壁纸横幅 ---
...image url="https://cn.bing.com/th?id=OHR.Fratercula_ZH-CN1239275412_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp" width=100% shape=0dp

// --- 每日一言 ---
...card-start title="📜 每日一言" shape=large contentPadding=(16,12)
    ...column-start vertical=spacedBy(8) horizontal=Center
> *"人生于我，一场豪赌而已。"*

        ...row-start horizontal=spacedBy(12)
            ...button-text text="📋 复制" event="copy{人生于我，一场豪赌而已。}"
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
            ...button-filled-tonal text="📖 Minecraft Wiki" event="url{https://minecraft.wiki/Launcher_0.8}" weight=(1)
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
            ...image url="https://cdn.modrinth.com/data/Wk3XEivh/c4b4e68800214deaf3933cdad1c0a72a7a7df287_96.webp" width=32dp shape=4dp
            ...column-start
                ...button-text text="FishingFailSave" event="url{https://modrinth.com/mod/fishingfailsave}"
                <span style="font-size:12px; color:#94a3b8;">📥 0.0M | 👤 whotakemyusername | 📅 2026-05-12</span>
                <span style="font-size:12px;">A simple mod that fixes the AutoLiteFishing mod by ynovka</span>
            ...column-end
        ...row-end

        ...row-start horizontal=spacedBy(8) vertical=Center
            ...image url="https://cdn.modrinth.com/data/ulYgRePv/3336a8a3de7413b48d793330aa406db8fe4fa4ff_96.webp" width=32dp shape=4dp
            ...column-start
                ...button-text text="LifeTime" event="url{https://modrinth.com/mod/life-time}"
                <span style="font-size:12px; color:#94a3b8;">📥 0.0M | 👤 Mischkah | 📅 2026-05-12</span>
                <span style="font-size:12px;">A highly customizable Minecraft mod that adds two in-game timers: a World Timer </span>
            ...column-end
        ...row-end

        ...row-start horizontal=spacedBy(8) vertical=Center
            ...image url="https://cdn.modrinth.com/data/uqnhwPGi/7eeee68b3b5940228e2685dfc5f82d16cfcd9e91.png" width=32dp shape=4dp
            ...column-start
                ...button-text text="Easier recipes" event="url{https://modrinth.com/mod/easier-recipes-fabric}"
                <span style="font-size:12px; color:#94a3b8;">📥 0.0M | 👤 PawKel | 📅 2026-05-12</span>
                <span style="font-size:12px;">A simple mod for adding any customizable crafting recipes to your Fabric server.</span>
            ...column-end
        ...row-end

        ...row-start horizontal=spacedBy(8) vertical=Center
            ...image url="https://cdn.modrinth.com/data/XtEbzMqr/ee0126286c387e79f84000cfb48889e60d2d0794_96.webp" width=32dp shape=4dp
            ...column-start
                ...button-text text="Safra" event="url{https://modrinth.com/mod/safra}"
                <span style="font-size:12px; color:#94a3b8;">📥 0.0M | 👤 DeveloperKubilay | 📅 2026-05-12</span>
                <span style="font-size:12px;">Don’t mess with the server Play Minecraft with your friends in 2 clicks</span>
            ...column-end
        ...row-end

        ...row-start horizontal=spacedBy(8) vertical=Center
            ...image url="https://cdn.modrinth.com/data/Hb92fpD3/cd0378c7310e0abe125adb5f7f047756012da1ac_96.webp" width=32dp shape=4dp
            ...column-start
                ...button-text text="Krave Client" event="url{https://modrinth.com/mod/krave-client}"
                <span style="font-size:12px; color:#94a3b8;">📥 0.0M | 👤 iqokcz95 | 📅 2026-05-12</span>
                <span style="font-size:12px;">Krave Client - is a Minecraft client with a large number of features developed f</span>
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

📖 **Wiki 推荐**：[Launcher 0.8](https://minecraft.wiki/Launcher_0.8)

⏰ 更新时间：2026-05-12 06:43:19

        ...row-start horizontal=spacedBy(12)
            ...button-text text="📖 Markdown教程" event="url{https://www.runoob.com/markdown/md-tutorial.html}"
            ...button-text text="🐙 项目源码" event="url{https://github.com/}"
        ...row-end
    ...column-end
...card-end
