// ============ 全局变量 ============
let currentMarkdown = '';
let currentFileName = 'home_page.md';
let isEditMode = false;

// ============ 事件处理 ============
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}

function handleEvent(eventStr) {
    const urlMatch = eventStr.match(/url\{\s*(.*?)\s*\}/);
    if (urlMatch) {
        window.open(urlMatch[1], '_blank');
        return;
    }
    const copyMatch = eventStr.match(/copy\{\s*(.*?)\s*\}/);
    if (copyMatch) {
        const text = copyMatch[1];
        navigator.clipboard.writeText(text).then(() => {
            showToast(`📋 已复制: ${text.length > 30 ? text.slice(0,30)+'…' : text}`);
        }).catch(() => showToast('复制失败'));
        return;
    }
    if (eventStr === 'launch_game') {
        showToast('🎮 启动游戏 (演示模式)');
    } else if (eventStr === 'check_update') {
        showToast('🔄 检查更新 (演示模式)');
    } else {
        showToast(`⚡ 事件: ${eventStr}`);
    }
}

// ============ 解析自定义扩展组件 ============
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function parseTuple(tupleStr) {
    if (!tupleStr) return null;
    const match = tupleStr.match(/^\(([\d\.,\s]+)\)$/);
    if (!match) return null;
    const parts = match[1].split(',').map(p => parseFloat(p.trim()));
    if (parts.length === 1) return { all: parts[0] };
    if (parts.length === 2) return { horizontal: parts[0], vertical: parts[1] };
    if (parts.length === 4) return { left: parts[0], top: parts[1], right: parts[2], bottom: parts[3] };
    return null;
}

function getAttribute(line, attrName) {
    const regex = new RegExp(`${attrName}=("([^"]*)"|([^\\s]+))`);
    const match = line.match(regex);
    if (match) return match[2] || match[3] || '';
    return '';
}

function parseCustomComponents(markdownText) {
    const lines = markdownText.split(/\r?\n/);
    let result = '';
    let inCodeBlock = false;
    
    const stack = [];
    let i = 0;
    
    while (i < lines.length) {
        let line = lines[i];
        const trimmed = line.trim();
        
        if (trimmed.startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            result += line + '\n';
            i++;
            continue;
        }
        
        if (inCodeBlock) {
            result += line + '\n';
            i++;
            continue;
        }
        
        if (trimmed.startsWith('//')) {
            i++;
            continue;
        }
        
        const componentMatch = trimmed.match(/^\.\.\.([a-z-]+)(?:\s+(.*))?$/);
        if (componentMatch) {
            const fullTag = componentMatch[1];
            const attrLine = componentMatch[2] || '';
            
            if (fullTag.endsWith('-end')) {
                const openTag = fullTag.replace('-end', '');
                if (stack.length && stack[stack.length-1].tag === openTag) {
                    stack.pop();
                    if (openTag === 'card') result += '</div></div>\n';
                    else if (openTag === 'row') result += '</div>\n';
                    else if (openTag === 'column') result += '</div>\n';
                    else result += `<!-- end ${fullTag} -->\n`;
                }
                i++;
                continue;
            }
            
            if (fullTag === 'card-start') {
                const title = getAttribute(attrLine, 'title');
                const shape = getAttribute(attrLine, 'shape');
                const paddingRaw = getAttribute(attrLine, 'contentPadding');
                const padding = parseTuple(paddingRaw);
                let style = '';
                if (shape) {
                    if (shape.endsWith('dp')) style += `border-radius: ${parseFloat(shape)}px;`;
                    else if (shape.endsWith('%')) style += `border-radius: ${shape};`;
                    else if (['small','medium','large','extraSmall','extraLarge'].includes(shape)) {
                        const radiusMap = { extraSmall: '4px', small: '8px', medium: '12px', large: '16px', extraLarge: '24px' };
                        style += `border-radius: ${radiusMap[shape] || '12px'};`;
                    }
                }
                let cardStyle = style ? ` style="${style}"` : '';
                let html = `<div class="custom-card"${cardStyle}>`;
                if (title) html += `<div class="card-title">${escapeHtml(title)}</div>`;
                let contentStyle = '';
                if (padding) {
                    if (padding.all !== undefined) contentStyle = `padding: ${padding.all}px;`;
                    else if (padding.horizontal !== undefined) contentStyle = `padding: ${padding.vertical}px ${padding.horizontal}px;`;
                    else if (padding.left !== undefined) contentStyle = `padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px;`;
                }
                html += `<div class="card-content" style="${contentStyle}">`;
                result += html;
                stack.push({ tag: 'card' });
                i++;
                continue;
            }
            
            if (fullTag === 'row-start') {
                result += '<div class="custom-row">\n';
                stack.push({ tag: 'row' });
                i++;
                continue;
            }
            
            if (fullTag === 'column-start') {
                result += '<div class="custom-column">\n';
                stack.push({ tag: 'column' });
                i++;
                continue;
            }
            
            if (['button', 'button-outlined', 'button-filled-tonal', 'button-text'].includes(fullTag)) {
                const text = getAttribute(attrLine, 'text');
                const eventVal = getAttribute(attrLine, 'event');
                const width = getAttribute(attrLine, 'width');
                const shape = getAttribute(attrLine, 'shape');
                
                let btnClass = 'btn';
                if (fullTag === 'button') btnClass += ' btn-filled';
                else if (fullTag === 'button-outlined') btnClass += ' btn-outlined';
                else if (fullTag === 'button-filled-tonal') btnClass += ' btn-filled-tonal';
                else if (fullTag === 'button-text') btnClass += ' btn-text';
                
                let style = '';
                if (width) {
                    if (width.endsWith('%')) style += `width: ${width};`;
                    else if (width.endsWith('dp')) style += `width: ${parseFloat(width)}px;`;
                }
                if (shape) {
                    if (shape.endsWith('dp')) style += `border-radius: ${parseFloat(shape)}px;`;
                    else if (shape.endsWith('%')) style += `border-radius: ${shape};`;
                }
                
                const onClick = eventVal ? `onclick="handleEvent('${escapeHtml(eventVal).replace(/'/g, "\\'")}')"` : '';
                result += `<button class="${btnClass}" style="${style}" ${onClick}>${escapeHtml(text)}</button>`;
                i++;
                continue;
            }
            
            if (fullTag === 'image') {
                const url = getAttribute(attrLine, 'url');
                const width = getAttribute(attrLine, 'width');
                const shape = getAttribute(attrLine, 'shape');
                let style = '';
                if (width) {
                    if (width.endsWith('%')) style += `width: ${width};`;
                    else if (width.endsWith('dp')) style += `width: ${parseFloat(width)}px;`;
                }
                if (shape) {
                    if (shape.endsWith('dp')) style += `border-radius: ${parseFloat(shape)}px;`;
                    else if (shape.endsWith('%')) style += `border-radius: ${shape};`;
                }
                result += `<img class="custom-image" src="${escapeHtml(url)}" style="${style}" alt="image" loading="lazy" onerror="this.src='https://placehold.co/400x200?text=Image+Load+Error'">`;
                i++;
                continue;
            }
            
            result += `<!-- 未识别的扩展组件: ${fullTag} -->\n`;
            i++;
            continue;
        }
        
        result += line + '\n';
        i++;
    }
    
    // 用占位符保护 HTML 标签
    const htmlPlaceholders = [];
    let processed = result.replace(/<div class="custom-[^"]+">|<\/div>|<button[^>]*>.*?<\/button>|<img[^>]*>/gs, (match) => {
        const idx = htmlPlaceholders.length;
        htmlPlaceholders.push(match);
        return `%%HTML_${idx}%%`;
    });
    
    let finalHtml = marked.parse(processed, { async: false });
    finalHtml = finalHtml.replace(/%%HTML_(\d+)%%/g, (match, idx) => htmlPlaceholders[parseInt(idx)] || '');
    
    return finalHtml;
}

// ============ 渲染预览 ============
function renderPreview() {
    const previewDiv = document.getElementById('previewContent');
    if (!currentMarkdown) {
        previewDiv.innerHTML = '<div class="error-msg">⚠️ 没有加载任何内容。请上传 MD 文件或新建文件。</div>';
        return;
    }
    
    try {
        const htmlContent = parseCustomComponents(currentMarkdown);
        previewDiv.innerHTML = htmlContent;
        document.getElementById('fileInfo').textContent = `当前文件: ${currentFileName}`;
    } catch (error) {
        previewDiv.innerHTML = `<div class="error-msg">❌ 解析错误: ${error.message}</div>`;
        console.error(error);
    }
}

// ============ 文件操作 ============
function loadMarkdown(content, filename = 'home_page.md') {
    currentMarkdown = content;
    currentFileName = filename;
    renderPreview();
    showToast(`✅ 已加载: ${filename}`);
}

async function loadFromUrl(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const content = await response.text();
        loadMarkdown(content, url.split('/').pop());
    } catch (error) {
        document.getElementById('previewContent').innerHTML = `<div class="error-msg">❌ 加载失败: ${error.message}<br><br>请确保文件存在，或使用上传功能。</div>`;
        showToast('加载失败: ' + error.message);
    }
}

function downloadMarkdown() {
    if (!currentMarkdown) {
        showToast('没有内容可下载');
        return;
    }
    const blob = new Blob([currentMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`💾 已下载: ${currentFileName}`);
}

function uploadMarkdown() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,.markdown,.txt';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            loadMarkdown(event.target.result, file.name);
            if (isEditMode) {
                document.getElementById('editorTextarea').value = event.target.result;
            }
        };
        reader.readAsText(file, 'UTF-8');
    };
    input.click();
}

function newFile() {
    const defaultContent = `// Zalith Launcher2 自定义主页
// 新建文件 - 请在此编写你的主页内容

# 欢迎使用 Zalith Launcher2

...card-start title="快速开始"
这是一个示例卡片。你可以在这里写 **Markdown** 内容。

...button text="点击示例" event="copy{Hello World!}"
...card-end
`;
    loadMarkdown(defaultContent, 'new_page.md');
    if (isEditMode) {
        document.getElementById('editorTextarea').value = defaultContent;
    }
    showToast('✨ 已创建新文件');
}

// ============ 编辑模式 ============
function toggleEditMode() {
    const editArea = document.getElementById('editArea');
    const editBtn = document.getElementById('editModeBtn');
    
    if (isEditMode) {
        // 退出编辑模式
        editArea.style.display = 'none';
        editBtn.textContent = '✏️ 编辑模式';
        isEditMode = false;
        showToast('已退出编辑模式');
    } else {
        // 进入编辑模式
        editArea.style.display = 'flex';
        document.getElementById('editorTextarea').value = currentMarkdown;
        editBtn.textContent = '👁️ 预览模式';
        isEditMode = true;
        showToast('进入编辑模式，修改后点击保存');
    }
}

function saveAndPreview() {
    const newContent = document.getElementById('editorTextarea').value;
    currentMarkdown = newContent;
    renderPreview();
    showToast('💾 已保存并刷新预览');
}

function cancelEdit() {
    document.getElementById('editorTextarea').value = currentMarkdown;
    showToast('已取消修改');
}

// ============ 初始化 ============
function init() {
    // 绑定事件
    document.getElementById('editModeBtn').onclick = toggleEditMode;
    document.getElementById('downloadBtn').onclick = downloadMarkdown;
    document.getElementById('uploadBtn').onclick = uploadMarkdown;
    document.getElementById('newFileBtn').onclick = newFile;
    document.getElementById('refreshPreviewBtn').onclick = () => renderPreview();
    document.getElementById('saveEditBtn').onclick = saveAndPreview;
    document.getElementById('cancelEditBtn').onclick = cancelEdit;
    
    // 尝试加载默认文件 home_page.md
    loadFromUrl('home_page.md').catch(() => {
        // 如果加载失败，尝试加载 sample.md
        loadFromUrl('sample.md').catch(() => {
            // 都失败则显示示例内容
            const sampleContent = `// Zalith Launcher2 示例主页
// 你可以上传自己的 MD 文件，或点击"新建文件"开始创作

# 🎮 欢迎使用 Zalith Launcher2

...card-start title="快速开始"
这是一个演示卡片，展示了自定义组件的用法。

...button-filled-tonal text="点击测试" event="copy{Hello World!}"
...card-end

---
### Markdown 支持

- 列表
- **粗体** 和 *斜体*
- [链接](https://github.com)
`;
            loadMarkdown(sampleContent, '示例主页.md');
        });
    });
}

// 启动
init();