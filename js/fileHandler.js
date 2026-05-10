/**
 * 文件处理 - 加载、保存、下载、上传
 */

// 加载内容
function loadContent(content, filename) {
    window.currentMarkdown = content;
    window.currentFileName = filename;
    renderPreview(content);
    document.getElementById('fileName').textContent = filename;
    
    const editor = document.getElementById('editor');
    if (editor) editor.value = content;
    
    showToast(`已加载: ${filename}`);
}

// 从 URL 加载
async function loadFromUrl(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const content = await res.text();
        loadContent(content, url.split('/').pop());
    } catch (e) {
        document.getElementById('preview').innerHTML = `<div class="error">加载失败: ${e.message}<br>请使用"上传"按钮选择文件</div>`;
        showToast('加载失败');
    }
}

// 下载文件
function downloadFile() {
    if (!window.currentMarkdown) {
        showToast('没有内容可下载');
        return;
    }
    const blob = new Blob([window.currentMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = window.currentFileName;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`已下载: ${window.currentFileName}`);
}

// 上传文件
function uploadFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,.markdown,.txt';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => loadContent(ev.target.result, file.name);
        reader.readAsText(file, 'UTF-8');
    };
    input.click();
}

// 新建文件（使用符合教程的示例）
function newFile() {
    const defaultContent = `// Zalith Launcher2 自定义主页
// 欢迎使用可视化编辑器！
// 注释行以 // 开头，不会显示在主页中

# 🎮 我的游戏中心

...card-start title="快速开始" shape=medium contentPadding=(16,12)
这是一个示例卡片。点击右上角 **编辑** 按钮开始修改！

...button-filled-tonal text="点击测试" event="copy {Hello World!}"
...card-end

---

### 横向布局示例

...row-start horizontal=spacedBy(8) vertical=Center
    ...button text="按钮1" weight=(1)
    ...button text="按钮2" weight=(1)
...row-end

### 图片示例

...image url="https://picsum.photos/800/200" width=100% shape=12dp
`;
    loadContent(defaultContent, '我的主页.md');
    showToast('已创建新文件');
}

// 保存编辑器内容
function saveFromEditor() {
    const editor = document.getElementById('editor');
    if (editor) {
        window.currentMarkdown = editor.value;
        renderPreview(window.currentMarkdown);
        showToast('已保存并刷新预览');
    }
}

// 导出到全局
window.loadContent = loadContent;
window.loadFromUrl = loadFromUrl;
window.downloadFile = downloadFile;
window.uploadFile = uploadFile;
window.newFile = newFile;
window.saveFromEditor = saveFromEditor;