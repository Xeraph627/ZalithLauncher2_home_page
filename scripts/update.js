const axios = require('axios');
const fs = require('fs');
const path = require('path');

// ============ 读取配置文件 ============
let CONFIG = {
    serverIp: '',
    qqGroup: '',
    discordInvite: '',
    fallbackWallpaper: 'https://api.bimg.cc/random?resolution=1920x1080'
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

if (process.env.SERVER_IP) CONFIG.serverIp = process.env.SERVER_IP;

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

// ============ 4. Modrinth 热门模组 ============
async function fetchModrinthHot() {
    const res = await axios.get('https://api.modrinth.com/v2/search?limit=5&index=follows', {
        headers: { 'User-Agent': 'ZalithHomepage/1.0' },
        timeout: 10000
    });
    return res.data.hits.map(hit => ({
        name: hit.title,
        url: `https://modrinth.com/mod/${hit.slug}`,
        desc: hit.description.substring(0, 40),
        downloads: hit.downloads ? `${(hit.downloads / 1000000).toFixed(1)}M` : 'N/A'
    }));
}

// ============ 5. MC 服务器状态 ============
async function fetchServerStatus() {
    if (!CONFIG.serverIp) return null;
    const res = await axios.get(`https://api.mcstatus.io/v2/status/java/${CONFIG.serverIp}`, { timeout: 10000 });
    const data = res.data;
    return {
        online: data.online,
        ip: data.ip,
        port: data.port,
        players: data.players?.online || 0,
        maxPlayers: data.players?.max || 0,
        version: data.version?.name_clean || '未知',
        motd: data.motd?.clean || '',
        icon: data.icon
    };
}

// ============ 生成主页 ============
async function generateHomePage() {
    console.log('🚀 开始生成主页...');
    console.log('⏰', new Date().toLocaleString('zh-CN'));

    const [bing, hitokoto, mcVersions, modrinthMods, serverStatus] = await Promise.all([
        getCachedOrFetch('bing', fetchBingWallpaper),
        getCachedOrFetch('hitokoto', fetchHitokoto),
        getCachedOrFetch('mcVersions', fetchMinecraftVersions),
        getCachedOrFetch('modrinth', fetchModrinthHot),
        getCachedOrFetch('serverStatus', fetchServerStatus, 2 * 60 * 1000)
    ]);

    // Modrinth 后备数据
    const finalModrinthMods = modrinthMods || [
        { name: 'Sodium', url: 'https://modrinth.com/mod/sodium', desc: '高性能渲染引擎', downloads: '15M+' },
        { name: 'Iris', url: 'https://modrinth.com/mod/iris', desc: '现代光影加载器', downloads: '8M+' },
        { name: 'Fabric API', url: 'https://modrinth.com/mod/fabric-api', desc: 'Fabric 核心 API', downloads: '20M+' },
        { name: 'Lithium', url: 'https://modrinth.com/mod/lithium', desc: '游戏逻辑优化', downloads: '10M+' },
        { name: 'Phosphor', url: 'https://modrinth.com/mod/phosphor', desc: '光照引擎优化', downloads: '5M+' }
    ];

    const modrinthList = finalModrinthMods.map(m => `- [${m.name}](${m.url}) - ${m.desc} (${m.downloads})`).join('\n        ');
    const versionInfo = mcVersions.recentReleases.map(v => `- **${v.id}** (${v.date})`).join('\n        ');

    // 服务器状态卡片
    let serverSection = '';
    if (serverStatus) {
        const statusColor = serverStatus.online ? '🟢' : '🔴';
        const statusText = serverStatus.online ? '在线' : '离线';
        const playerText = serverStatus.online ? `${serverStatus.players}/${serverStatus.maxPlayers}` : 'N/A';
        serverSection = `
// --- 🎮 服务器状态 ---
...card-start title="🎮 我的服务器" shape=medium contentPadding=(12)
    ...column-start vertical=spacedBy(4) horizontal=Start
        ${statusColor} **${statusText}** | ${serverStatus.ip}:${serverStatus.port}

        版本: ${serverStatus.version} | 在线玩家: ${playerText}

        > ${serverStatus.motd || '欢迎来到服务器！'}

        ...row-start horizontal=spacedBy(8)
            ...button text="📋 复制IP" event="copy{${serverStatus.ip}:${serverStatus.port}}" weight=(1)
            ...button-outlined text="🔄 刷新" event="url{https://api.mcstatus.io/v2/status/java/${CONFIG.serverIp}}" weight=(1)
        ...row-end
    ...column-end
...card-end`;
    }

    const md = `// ============================================
// 🎮 Zalith Launcher 2 - 全自动更新主页
// 生成时间：${new Date().toLocaleString('zh-CN')}
// 数据来源：Bing | 一言 | Mojang | Modrinth | 静态配置
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

${serverSection}

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

// --- 🧩 Modrinth 热门（实时API）---
...card-start title="🧩 Modrinth 热门" shape=medium contentPadding=(12)
    ...column-start vertical=spacedBy(6) horizontal=Start
        ${modrinthList}

        ...row-start horizontal=spacedBy(8)
            ...button text="📥 访问 Modrinth" event="url{https://modrinth.com/mods}" weight=(1)
        ...row-end
    ...column-end
...card-end

// --- 🛠️ 实用工具 ---
...card-start title="🧰 实用工具" shape=medium contentPadding=(12)
    ...row-start horizontal=spacedBy(8) vertical=Top
        ...column-start weight=(1) vertical=spacedBy(8) horizontal=Center
            ...button-outlined text="📋 复制服务器IP" event="copy{${CONFIG.serverIp || 'play.example.com'}}" width=100%
            ...button-outlined text="📋 复制QQ群" event="copy{${CONFIG.qqGroup || '123456789'}}" width=100%
            ...button-outlined text="📋 复制 Discord" event="copy{${CONFIG.discordInvite || 'discord.gg/xxxx'}}" width=100%
        ...column-end
        ...column-start weight=(1) vertical=spacedBy(8) horizontal=Center
            ...button-outlined text="🌙 夜间模式" event="copy{夜间模式功能暂未接入}" width=100%
            ...button-outlined text="⚙️ 游戏设置" event="copy{请前往启动器设置}" width=100%
            ...button-outlined text="📁 存档目录" event="copy{请手动打开 .minecraft/saves}" width=100%
        ...row-end
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

// --- ℹ️ 关于 ---
...card-start title="ℹ️ 关于" shape=small contentPadding=(12)
    ...column-start vertical=spacedBy(4) horizontal=Center
**Zalith Launcher 2** 自动更新主页

🖼️ 壁纸：${bing.title}
        ${bing.copyright ? '© ' + bing.copyright : ''}

⏰ 更新时间：${new Date().toLocaleString('zh-CN')}

        ...row-start horizontal=spacedBy(12)
            ...button-text text="📖 Markdown教程" event="url{https://www.runoob.com/markdown/md-tutorial.html}"
            ...button-text text="🐙 项目源码" event="url{https://github.com/}"
        ...row-end
    ...column-end
...card-end
`;

    fs.writeFileSync('home_page.md', md);
    console.log('\n✅ 主页生成完成！');
    console.log('📁 文件：home_page.md');
    console.log(`📅 时间：${new Date().toLocaleString('zh-CN')}`);
    console.log(`🖼️ 壁纸：${bing.title}`);
    console.log(`💬 一言：${hitokoto.text}`);
    console.log(`📦 MC版本：${mcVersions.latestRelease} / ${mcVersions.latestSnapshot}`);
    console.log(`🧩 Modrinth：${finalModrinthMods.length} 个模组`);
    if (serverStatus) console.log(`🎮 服务器：${serverStatus.online ? '在线' : '离线'} ${serverStatus.players}/${serverStatus.maxPlayers}`);
}

generateHomePage().catch(err => {
    console.error('❌ 生成失败:', err);
    process.exit(1);
});