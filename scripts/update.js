const axios = require('axios');
const fs = require('fs');
const path = require('path');

// ============ 路径配置 ============
const SCRIPT_DIR = __dirname;
const ROOT_DIR = path.join(SCRIPT_DIR, '..');
const CONFIG_PATH = path.join(SCRIPT_DIR, 'config.json');
const OUTPUT_PATH = path.join(ROOT_DIR, 'home_page.md');

// ============ 读取配置文件 ============
let CONFIG = {
    serverIp: '',
    qqGroup: '123456789',
    authorUrl: 'https://ssbtt114514.github.io/',
    authorName: 'ssbtt114514'
};

try {
    if (fs.existsSync(CONFIG_PATH)) {
        const userConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
        CONFIG = { ...CONFIG, ...userConfig };
        console.log('✅ 已加载配置文件:', CONFIG_PATH);
    } else {
        console.log('⚠️ 未找到 config.json，使用默认配置');
    }
} catch (e) {
    console.error('❌ 配置文件解析失败，使用默认配置:', e.message);
}

if (process.env.SERVER_IP) CONFIG.serverIp = process.env.SERVER_IP;

// ============ 简单缓存 ============
const CACHE_TTL = 60 * 60 * 1000;
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

// ============ 网络时间获取 ============
async function fetchBeijingTime() {
    try {
        const res = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Shanghai', { timeout: 8000 });
        const datetime = res.data.datetime;
        const beijingTime = new Date(datetime);
        
        const year = beijingTime.getFullYear();
        const month = String(beijingTime.getMonth() + 1).padStart(2, '0');
        const day = String(beijingTime.getDate()).padStart(2, '0');
        const hours = String(beijingTime.getHours()).padStart(2, '0');
        const minutes = String(beijingTime.getMinutes()).padStart(2, '0');
        const seconds = String(beijingTime.getSeconds()).padStart(2, '0');
        
        return {
            full: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
            date: `${year}-${month}-${day}`,
            time: `${hours}:${minutes}:${seconds}`
        };
    } catch (e) {
        console.error('❌ 网络时间获取失败，使用本地时间:', e.message);
        const localNow = new Date();
        const year = localNow.getFullYear();
        const month = String(localNow.getMonth() + 1).padStart(2, '0');
        const day = String(localNow.getDate()).padStart(2, '0');
        const hours = String(localNow.getHours()).padStart(2, '0');
        const minutes = String(localNow.getMinutes()).padStart(2, '0');
        const seconds = String(localNow.getSeconds()).padStart(2, '0');
        return {
            full: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
            date: `${year}-${month}-${day}`,
            time: `${hours}:${minutes}:${seconds}`
        };
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
        text: res.data.hitokoto
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
        recentReleases: recentReleases.map(v => ({ id: v.id, date: v.releaseTime.split('T')[0] }))
    };
}

// ============ 4. Minecraft Wiki 随机推荐 ============
async function fetchMinecraftWiki() {
    try {
        const res = await axios.get('https://minecraft.wiki/api.php', {
            params: {
                action: 'query',
                format: 'json',
                list: 'random',
                rnnamespace: 0,
                rnlimit: 1
            },
            timeout: 10000
        });
        
        const page = res.data.query.random[0];
        return {
            title: page.title,
            url: `https://minecraft.wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`,
            description: `推荐阅读：${page.title}`
        };
    } catch (e) {
        console.error('❌ Minecraft Wiki 获取失败:', e.message);
        return {
            title: '红石电路',
            url: 'https://minecraft.wiki/Redstone_circuit',
            description: '推荐阅读：红石电路'
        };
    }
}

// ============ 5. Modrinth 最新模组（使用搜索 API） ============
async function fetchModrinthLatest() {
    try {
        // 使用 Modrinth 搜索 API
        // 参数说明：
        // - limit=5: 获取5条结果
        // - index=newest: 按最新发布排序
        // - facets: 筛选 project_type:mod（模组类型）
        const url = 'https://api.modrinth.com/v2/search?' + new URLSearchParams({
            query: '',
            limit: '5',
            index: 'newest',
            facets: JSON.stringify([["project_type:mod"]])
        });
        
        console.log('📡 请求 Modrinth API:', url);
        
        const res = await axios.get(url, {
            headers: { 'User-Agent': 'ZalithHomepage/1.0' },
            timeout: 10000
        });
        
        if (!res.data.hits || res.data.hits.length === 0) {
            throw new Error('未获取到模组数据');
        }
        
        console.log(`✅ 获取到 ${res.data.hits.length} 个最新模组`);
        
        // 提取完整信息
        return res.data.hits.map(hit => ({
            name: hit.title,
            slug: hit.slug,
            url: `https://modrinth.com/mod/${hit.slug}`,
            description: hit.description ? hit.description.substring(0, 80) : '暂无描述',
            downloads: hit.downloads ? `${(hit.downloads / 1000000).toFixed(1)}M` : 'N/A',
            iconUrl: hit.icon_url || `https://cdn.modrinth.com/data/${hit.project_id}/icon.png`,
            author: hit.author || '未知',
            created: hit.date_created ? hit.date_created.split('T')[0] : '未知',
            updated: hit.date_modified ? hit.date_modified.split('T')[0] : '未知',
            versions: hit.versions ? hit.versions.length : 0
        }));
    } catch (e) {
        console.error('❌ Modrinth 获取失败:', e.message);
        // 返回备用数据
        return [
            { name: 'Sodium', slug: 'sodium', url: 'https://modrinth.com/mod/sodium', description: '高性能渲染引擎，大幅提升FPS', downloads: '15M+', iconUrl: 'https://cdn.modrinth.com/data/AANobbMI/icon.png', author: 'JellySquid', created: '2020-05-01', versions: 45 },
            { name: 'Iris', slug: 'iris', url: 'https://modrinth.com/mod/iris', description: '现代光影加载器', downloads: '8M+', iconUrl: 'https://cdn.modrinth.com/data/YL57xq9U/icon.png', author: 'Iris Team', created: '2021-04-15', versions: 32 },
            { name: 'Fabric API', slug: 'fabric-api', url: 'https://modrinth.com/mod/fabric-api', description: 'Fabric 模组加载器核心 API', downloads: '20M+', iconUrl: 'https://cdn.modrinth.com/data/P7dR8mSH/icon.png', author: 'FabricMC', created: '2018-12-10', versions: 120 }
        ];
    }
}

// ============ 6. MC 服务器状态 ============
async function fetchServerStatus() {
    if (!CONFIG.serverIp) return null;
    try {
        const res = await axios.get(`https://api.mcstatus.io/v2/status/java/${CONFIG.serverIp}`, { timeout: 10000 });
        const data = res.data;
        return {
            online: data.online,
            ip: data.ip,
            port: data.port,
            players: data.players?.online || 0,
            maxPlayers: data.players?.max || 0,
            version: data.version?.name_clean || '未知',
            motd: data.motd?.clean || ''
        };
    } catch (e) {
        console.error('❌ 服务器状态获取失败:', e.message);
        return null;
    }
}

// ============ 生成主页 ============
async function generateHomePage() {
    console.log('🚀 开始生成主页...');
    
    const now = await fetchBeijingTime();
    console.log('⏰ 网络时间:', now.full);
    console.log('📁 输出路径:', OUTPUT_PATH);

    const [bing, hitokoto, mcVersions, modrinthMods, wikiPage, serverStatus] = await Promise.all([
        getCachedOrFetch('bing', fetchBingWallpaper),
        getCachedOrFetch('hitokoto', fetchHitokoto),
        getCachedOrFetch('mcVersions', fetchMinecraftVersions),
        getCachedOrFetch('modrinthLatest', fetchModrinthLatest, 10 * 60 * 1000),
        getCachedOrFetch('wiki', fetchMinecraftWiki, 30 * 60 * 1000),
        getCachedOrFetch('serverStatus', fetchServerStatus, 2 * 60 * 1000)
    ]);

    // 构建 Modrinth 列表（带详细信息）
    const modrinthRows = modrinthMods.map(mod => {
        return `        ...row-start horizontal=spacedBy(8) vertical=Center
            ...image url="${mod.iconUrl}" width=32dp shape=4dp
            ...column-start
                ...button-text text="${mod.name}" event="url{${mod.url}}"
                <span style="font-size:12px; color:#94a3b8;">📥 ${mod.downloads} | 👤 ${mod.author} | 📅 ${mod.created}</span>
                <span style="font-size:12px;">${mod.description}</span>
            ...column-end
        ...row-end`;
    }).join('\n\n');

    // 构建版本信息
    const versionInfo = mcVersions.recentReleases.map(v => `- **${v.id}** (${v.date})`).join('\n        ');

    // 构建服务器状态卡片
    let serverSection = '';
    if (serverStatus && serverStatus.online) {
        serverSection = `
// --- 🎮 服务器状态 ---
...card-start title="🎮 我的服务器" shape=medium contentPadding=(12)
    ...column-start vertical=spacedBy(4) horizontal=Start
        🟢 **在线** | ${serverStatus.ip}:${serverStatus.port}

        版本: ${serverStatus.version} | 在线玩家: ${serverStatus.players}/${serverStatus.maxPlayers}

        > ${serverStatus.motd || '欢迎来到服务器！'}

        ...row-start horizontal=spacedBy(8)
            ...button text="📋 复制IP" event="copy{${serverStatus.ip}:${serverStatus.port}}" weight=(1)
        ...row-end
    ...column-end
...card-end`;
    }

    // 生成完整 Markdown
    const md = `// ============================================
// 🎮 Zalith Launcher 2 - 全自动更新主页
// 生成时间：${now.full}
// 数据来源：Bing | 一言 | Mojang | Modrinth | Minecraft Wiki
// ============================================

// --- Bing 每日壁纸横幅 ---
...image url="${bing.url}" width=100% shape=0dp

// --- 每日一言 ---
...card-start title="📜 每日一言" shape=large contentPadding=(16,12)
    ...column-start vertical=spacedBy(8) horizontal=Center
> *"${hitokoto.text}"*

        ...row-start horizontal=spacedBy(12)
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
            ...button-filled-tonal text="📖 Minecraft Wiki" event="url{${wikiPage.url}}" weight=(1)
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
${modrinthRows}

        ...row-start horizontal=spacedBy(8)
            ...button text="📥 访问 Modrinth" event="url{https://modrinth.com/mods}" weight=(1)
        ...row-end
    ...column-end
...card-end

// --- 🛠️ 实用工具 ---
...card-start title="🧰 实用工具" shape=medium contentPadding=(12)
    ...column-start vertical=spacedBy(8) horizontal=Center
        ...button-outlined text="📋 复制QQ群" event="copy{${CONFIG.qqGroup}}" width=50%
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

🖼️ 壁纸：${bing.title}
        ${bing.copyright ? '© ' + bing.copyright : ''}

👤 **作者**：[${CONFIG.authorName}](${CONFIG.authorUrl})

📖 **Wiki 推荐**：[${wikiPage.title}](${wikiPage.url})

⏰ 更新时间：${now.full}

        ...row-start horizontal=spacedBy(12)
            ...button-text text="📖 Markdown教程" event="url{https://www.runoob.com/markdown/md-tutorial.html}"
            ...button-text text="🐙 项目源码" event="url{https://github.com/}"
        ...row-end
    ...column-end
...card-end
`;

    fs.writeFileSync(OUTPUT_PATH, md, 'utf8');
    console.log('\n✅ 主页生成完成！');
    console.log('📁 文件:', OUTPUT_PATH);
    console.log(`📅 生成时间: ${now.full}`);
    console.log(`🖼️ 壁纸：${bing.title}`);
    console.log(`💬 一言：${hitokoto.text}`);
    console.log(`📦 MC版本：${mcVersions.latestRelease} / ${mcVersions.latestSnapshot}`);
    console.log(`🧩 Modrinth：${modrinthMods.length} 个最新模组`);
    console.log(`📖 Wiki推荐：${wikiPage.title}`);
    if (serverStatus) console.log(`🎮 服务器：在线 ${serverStatus.players}/${serverStatus.maxPlayers}`);
}

generateHomePage().catch(err => {
    console.error('❌ 生成失败:', err);
    process.exit(1);
});