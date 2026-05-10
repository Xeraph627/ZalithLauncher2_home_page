const axios = require('axios');
const fs = require('fs');
const path = require('path');

// ============ 读取配置文件 ============
let CONFIG = {
    qqGroup: '123456789',
    discordInvite: 'discord.gg/xxxx',
    fallbackWallpaper: 'https://api.bimg.cc/random?resolution=1920x1080',
    authorUrl: 'https://ssbtt114514.github.io/',   // 作者链接
    authorName: 'ssbtt114514'
};

try {
    const configPath = path.join(__dirname, 'config.json');
    if (fs.existsSync(configPath)) {
        const userConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        CONFIG = { ...CONFIG, ...userConfig };
        console.log('✅ 已加载配置文件 config.json');
    } else {
        console.log('⚠️ 未找到 config.json，使用默认配置');
    }
} catch (e) {
    console.error('❌ 配置文件解析失败，使用默认配置:', e.message);
}

// ============ 简单缓存 ============
const CACHE_TTL = 60 * 60 * 1000; // 1小时
const cache = {};

async function getCachedOrFetch(key, fetchFn, ttl = CACHE_TTL) {
    const now = Date.now();
    if (cache[key] && (now - cache[key].timestamp) < ttl) {
        console.log(`📦 使用缓存: ${key}`);
        return cache[key].data;
    }
    try {
        const data = await fetchFn();
        cache[key] = { data, timestamp: now };
        return data;
    } catch (e) {
        console.error(`❌ 获取 ${key} 失败:`, e.message);
        return null;
    }
}

// ============ 1. Bing 每日壁纸 ============
async function fetchBingWallpaper() {
    const res = await axios.get('https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN', { timeout: 10000 });
    const data = res.data.images[0];
    return {
        url: `https://cn.bing.com${data.url}`,
        title: data.title || 'Bing 每日壁纸',
        copyright: data.copyright || ''
    };
}

// ============ 2. 每日一言 ============
async function fetchHitokoto() {
    const categories = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'];
    const randomCat = categories[Math.floor(Math.random() * categories.length)];
    const res = await axios.get(`https://v1.hitokoto.cn/?c=${randomCat}&encode=json`, { timeout: 5000 });
    return {
        text: res.data.hitokoto,
        from: res.data.from || '未知',
        from_who: res.data.from_who || ''
    };
}

// ============ 3. MC 最新版本信息 ============
async function fetchMinecraftVersions() {
    const res = await axios.get('https://piston-meta.mojang.com/mc/game/version_manifest_v2.json', { timeout: 10000 });
    const { latest, versions } = res.data;
    const recentReleases = versions.filter(v => v.type === 'release').slice(0, 3);
    const latestSnapshot = versions.find(v => v.type === 'snapshot');
    return {
        latestRelease: latest.release,
        latestSnapshot: latest.snapshot,
        recentReleases: recentReleases.map(v => ({ id: v.id, date: v.releaseTime.split('T')[0] })),
        snapshot: latestSnapshot ? { id: latestSnapshot.id, date: latestSnapshot.releaseTime.split('T')[0] } : null
    };
}

// ============ 4. Modrinth 热门模组（含图标）============
async function fetchModrinthHot() {
    const res = await axios.get('https://api.modrinth.com/v2/search?limit=5&index=follows', {
        headers: { 'User-Agent': 'ZalithHomepage/1.0' },
        timeout: 10000
    });
    return res.data.hits.map(hit => ({
        name: hit.title,
        slug: hit.slug,
        url: `https://modrinth.com/mod/${hit.slug}`,
        description: hit.description.substring(0, 40),
        downloads: hit.downloads ? `${(hit.downloads / 1000000).toFixed(1)}M` : 'N/A',
        iconUrl: hit.icon_url || `https://cdn.modrinth.com/data/${hit.project_id}/icon.png` // fallback
    }));
}

// ============ 生成主页 ============
async function generateHomePage() {
    console.log('🚀 开始生成主页...');
    console.log('⏰', new Date().toLocaleString('zh-CN'));

    const [bing, hitokoto, mcVersions, modrinthMods] = await Promise.all([
        getCachedOrFetch('bing', fetchBingWallpaper),
        getCachedOrFetch('hitokoto', fetchHitokoto),
        getCachedOrFetch('mcVersions', fetchMinecraftVersions),
        getCachedOrFetch('modrinth', fetchModrinthHot)
    ]);

    // Modrinth 后备数据（当 API 失败时使用）
    const finalModrinthMods = modrinthMods || [
        { name: 'Sodium', slug: 'sodium', url: 'https://modrinth.com/mod/sodium', description: '高性能渲染引擎', downloads: '15M+', iconUrl: 'https://cdn.modrinth.com/data/AANobbMI/icon.png' },
        { name: 'Iris', slug: 'iris', url: 'https://modrinth.com/mod/iris', description: '现代光影加载器', downloads: '8M+', iconUrl: 'https://cdn.modrinth.com/data/YL57xq9U/icon.png' },
        { name: 'Fabric API', slug: 'fabric-api', url: 'https://modrinth.com/mod/fabric-api', description: 'Fabric 核心 API', downloads: '20M+', iconUrl: 'https://cdn.modrinth.com/data/P7dR8mSH/icon.png' },
        { name: 'Lithium', slug: 'lithium', url: 'https://modrinth.com/mod/lithium', description: '游戏逻辑优化', downloads: '10M+', iconUrl: 'https://cdn.modrinth.com/data/gvQqBUqZ/icon.png' },
        { name: 'Phosphor', slug: 'phosphor', url: 'https://modrinth.com/mod/phosphor', description: '光照引擎优化', downloads: '5M+', iconUrl: 'https://cdn.modrinth.com/data/9pc0y4kz/icon.png' }
    ];

    // 构建 Modrinth 列表（带图片和按钮文本）
    const modrinthRows = finalModrinthMods.map(mod => {
        return `        ...row-start horizontal=spacedBy(8) vertical=Center
            ...image url="${mod.iconUrl}" width=24dp shape=4dp
            ...button-text text="${mod.name} - ${mod.description} (${mod.downloads})" event="url{${mod.url}}"
        ...row-end`;
    }).join('\n\n');

    // 构建版本信息列表
    const versionInfo = mcVersions.recentReleases.map(v => `- **${v.id}** (${v.date})`).join('\n        ');

    // 生成最终 Markdown（已删除服务器部分）
    const md = `// ============================================
// 🎮 Zalith Launcher 2 - 全自动更新主页
// 生成时间：${new Date().toLocaleString('zh-CN')}
// 数据来源：Bing | 一言 | Mojang | Modrinth
// ============================================

// --- Bing 每日壁纸横幅 ---
...image url="${bing.url}" width=100% shape=0dp

// --- 每日一言 ---
...card-start title="📜 每日一言" shape=large contentPadding=(16, 12)
    ...column-start vertical=spacedBy(8) horizontal=Center
> *"${hitokoto.text}"*

—— ${hitokoto.from}${hitokoto.from_who ? ' · ' + hitokoto.from_who : ''}

        ...row-start horizontal=spacedBy(12)
            ...button-filled-tonal text="🔄 刷新" event="copy{https://v1.hitokoto.cn/?c=a}" width=100dp
            ...button-text text="📋 复制" event="copy{${hitokoto.text}}"
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
**最新正式版**: ${mcVersions.latestRelease}
**最新快照**: ${mcVersions.latestSnapshot}

近期版本：
        ${versionInfo}

        ...row-start horizontal=spacedBy(8)
            ...button text="📥 官方下载" event="url{https://www.minecraft.net/zh-hans/download}" weight=(1)
            ...button text="📋 复制版本号" event="copy{${mcVersions.latestRelease}}" weight=(1)
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
            ...button-filled-tonal text="⬇️ 下载站" event="url{https://www.mcmod.cn/download.html}" weight=(1)
            ...button-filled-tonal text="💬 论坛" event="url{https://bbs.mcmod.cn/}" weight=(1)
        ...row-end
        ...row-start horizontal=spacedBy(8)
            ...button text="🌐 CurseForge" event="url{https://www.curseforge.com/minecraft/mcmods}" weight=(1)
            ...button text="🌐 Modrinth" event="url{https://modrinth.com/mods}" weight=(1)
        ...row-end
    ...column-end
...card-end

// --- 🧩 Modrinth 热门（含模组图标）---
...card-start title="🧩 Modrinth 热门" shape=medium contentPadding=(12)
    ...column-start vertical=spacedBy(10) horizontal=Start
${modrinthRows}

        ...row-start horizontal=spacedBy(8)
            ...button text="📥 访问 Modrinth" event="url{https://modrinth.com/mods}" weight=(1)
        ...row-end
    ...column-end
...card-end

// --- 🛠️ 实用工具 ---
...card-start title="🧰 实用工具" shape=medium contentPadding=(12)
    ...row-start horizontal=spacedBy(8) vertical=Top
        ...column-start weight=(1) vertical=spacedBy(8) horizontal=Center
            ...button-outlined text="📋 复制服务器IP" event="copy{play.mcmod.cn}" width=100%
            ...button-outlined text="📋 复制QQ群" event="copy{${CONFIG.qqGroup}}" width=100%
            ...button-outlined text="📋 复制 Discord" event="copy{${CONFIG.discordInvite}}" width=100%
        ...column-end
        ...column-start weight=(1) vertical=spacedBy(8) horizontal=Center
            ...button-outlined text="🌙 夜间模式" event="copy{夜间模式功能暂未接入}" width=100%
            ...button-outlined text="⚙️ 游戏设置" event="copy{请前往启动器设置}" width=100%
            ...button-outlined text="📁 存档目录" event="copy{请手动打开 .minecraft/saves}" width=100%
        ...column-end
    ...row-end
...card-end

// --- 📸 精选壁纸 ---
...card-start title="🎨 更多壁纸" shape=medium contentPadding=(12)
    ...row-start horizontal=spacedBy(8) vertical=Center
        ...image url="https://api.bimg.cc/random?resolution=1920x1080&index=1" width=30% shape=8dp weight=(1)
        ...image url="https://api.bimg.cc/random?resolution=1920x1080&index=2" width=30% shape=8dp weight=(1)
        ...image url="https://api.bimg.cc/random?resolution=1920x1080&index=3" width=30% shape=8dp weight=(1)
    ...row-end
...card-end

// --- ℹ️ 关于（含作者链接）---
...card-start title="ℹ️ 关于" shape=small contentPadding=(12)
    ...column-start vertical=spacedBy(4) horizontal=Center
**Zalith Launcher 2** 自动更新主页

🖼️ 壁纸：${bing.title}
        ${bing.copyright ? '© ' + bing.copyright : ''}

👤 **作者**：[${CONFIG.authorName}](${CONFIG.authorUrl})

⏰ 更新时间：${new Date().toLocaleString('zh-CN')}

        ...row-start horizontal=spacedBy(12)
            ...button-text text="📖 Markdown教程" event="url{https://www.runoob.com/markdown/md-tutorial.html}"
            ...button-text text="🐙 项目源码" event="url{https://github.com/}"
        ...row-end
    ...column-end
...card-end
`;

    // 以 UTF-8 写入文件（确保无乱码）
    fs.writeFileSync('home_page.md', md, 'utf8');
    console.log('\n✅ 主页生成完成！');
    console.log('📁 文件：home_page.md');
    console.log(`📅 时间：${new Date().toLocaleString('zh-CN')}`);
    console.log(`🖼️ 壁纸：${bing.title}`);
    console.log(`💬 一言：${hitokoto.text}`);
    console.log(`📦 MC版本：${mcVersions.latestRelease} / ${mcVersions.latestSnapshot}`);
    console.log(`🧩 Modrinth：${finalModrinthMods.length} 个模组（含图标）`);
}

generateHomePage().catch(err => {
    console.error('❌ 生成失败:', err);
    process.exit(1);
});