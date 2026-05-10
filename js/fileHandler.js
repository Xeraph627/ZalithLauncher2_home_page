/**
 * 文件处理 - 加载、保存、下载、上传
 */

let currentMarkdown = '';
let currentFileName = 'home_page.md';

// 加载内容
function loadContent(content, filename) {
    currentMarkdown = content;
    currentFileName = filename;
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
    if (!currentMarkdown) {
        showToast('没有内容可下载');
        return;
    }
    const blob = new Blob([currentMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFileName;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`已下载: ${currentFileName}`);
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

// 新建文件
function newFile() {
    const defaultContent = `// Zalith Launcher2 自定义主页
// 欢迎使用可视化编辑器！

# 🎮 我的游戏中心

...card-start title="快速开始"
这是一个示例卡片。点击右上角"编辑"按钮开始修改！

...button-filled-tonal text="点击测试" event="copy{Hello World!}"
...card-end

---
### 试试看

点击左侧的组件按钮，快速添加卡片、按钮、图片等内容！
`;
    loadContent(defaultContent, '我的主页.md');
    showToast('已创建新文件');
}

// 保存编辑器内容
function saveFromEditor() {
    const editor = document.getElementById('editor');
    if (editor) {
        currentMarkdown = editor.value;
        renderPreview(currentMarkdown);
        showToast('已保存并刷新预览');
    }
}