// ============ 全局变量 ============
let currentMarkdown = '';
let currentFileName = 'home_page.md';
let isEditMode = false;
let pendingComponent = null;

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

// ============ 组件模板定义 ============
const componentTemplates = {
    card: {
        title: '添加卡片',
        fields: [
            { name: 'title', label: '卡片标题', type: 'text', placeholder: '例如：我的卡片', hint: '可选，留空则不显示标题' },
            { name: 'shape', label: '圆角大小', type: 'select', options: ['medium', 'small', 'large', 'extraSmall', 'extraLarge', '12dp', '20%'], hint: '预设大小或自定义（如12dp、20%）' },
            { name: 'contentPadding', label: '内边距', type: 'text', placeholder: '(16, 12)', hint: '格式：(all) 或 (水平, 垂直) 或 (左, 上, 右, 下)' }
        ],
        template: (data) => {
            let attrs = '';
            if (data.title) attrs += ` title="${data.title}"`;
            if (data.shape) attrs += ` shape=${data.shape}`;
            if (data.contentPadding) attrs += ` contentPadding=${data.contentPadding}`;
            return `...card-start${attrs}\n在此输入卡片内容\n...card-end`;
        }
    },
    'button-filled': {
        title: '添加填充按钮',
        fields: [
            { name: 'text', label: '按钮文字', type: 'text', required: true, placeholder: '例如：点击我', hint: '按钮上显示的文字' },
            { name: 'event', label: '点击事件', type: 'select', options: ['url{https://}', 'copy{文本}', 'launch_game', 'check_update'], hint: '选择事件类型后修改{}内的内容' },
            { name: 'width', label: '宽度', type: 'text', placeholder: 'auto', hint: '例如：50% 或 120dp' }
        ],
        template: (data) => {
            let attrs = `text="${data.text}"`;
            if (data.event && data.event !== 'url{https://}') attrs += ` event="${data.event}"`;
            else if (data.event === 'url{https://}') attrs += ` event="url{https://example.com}"`;
            if (data.width && data.width !== 'auto') attrs += ` width=${data.width}`;
            return `...button ${attrs}`;
        }
    },
    'button-outlined': {
        title: '添加外框按钮',
        fields: [
            { name: 'text', label: '按钮文字', type: 'text', required: true, placeholder: '例如：点击我' },
            { name: 'event', label: '点击事件', type: 'select', options: ['url{https://}', 'copy{文本}', 'launch_game', 'check_update'] },
            { name: 'width', label: '宽度', type: 'text', placeholder: 'auto', hint: '例如：50% 或 120dp' }
        ],
        template: (data) => {
            let attrs = `text="${data.text}"`;
            if (data.event && data.event !== 'url{https://}') attrs += ` event="${data.event}"`;
            else if (data.event === 'url{https://}') attrs += ` event="url{https://example.com}"`;
            if (data.width && data.width !== 'auto') attrs += ` width=${data.width}`;
            return `...button-outlined ${attrs}`;
        }
    },
    'button-tonal': {
        title: '添加色调按钮',
        fields: [
            { name: 'text', label: '按钮文字', type: 'text', required: true, placeholder: '例如：点击我' },
            { name: 'event', label: '点击事件', type: 'select', options: ['url{https://}', 'copy{文本}', 'launch_game', 'check_update'] },
            { name: 'width', label: '宽度', type: 'text', placeholder: 'auto' }
        ],
        template: (data) => {
            let attrs = `text="${data.text}"`;
            if (data.event && data.event !== 'url{https://}') attrs += ` event="${data.event}"`;
            else if (data.event === 'url{https://}') attrs += ` event="url{https://example.com}"`;
            if (data.width && data.width !== 'auto') attrs += ` width=${data.width}`;
            return `...button-filled-tonal ${attrs}`;
        }
    },
    'button-text': {
        title: '添加文字按钮',
        fields: [
            { name: 'text', label: '按钮文字', type: 'text', required: true, placeholder: '例如：了解更多' },
            { name: 'event', label: '点击事件', type: 'select', options: ['url{https://}', 'copy{文本}', 'launch_game', 'check_update'] },
            { name: 'width', label: '宽度', type: 'text', placeholder: 'auto' }
        ],
        template: (data) => {
            let attrs = `text="${data.text}"`;
            if (data.event && data.event !== 'url{https://}') attrs += ` event="${data.event}"`;
            else if (data.event === 'url{https://}') attrs += ` event="url{https://example.com}"`;
            if (data.width && data.width !== 'auto') attrs += ` width=${data.width}`;
            return `...button-text ${attrs}`;
        }
    },
    image: {
        title: '添加图片',
        fields: [
            { name: 'url', label: '图片链接', type: 'text', required: true, placeholder: 'https://example.com/image.jpg', hint: '必填，支持网络图片' },
            { name: 'width', label: '宽度', type: 'text', placeholder: '100%', hint: '例如：50% 或 200dp' },
            { name: 'shape', label: '圆角', type: 'text', placeholder: '12dp', hint: '例如：12dp 或 20%' }
        ],
        template: (data) => {
            let attrs = `url="${data.url}"`;
            if (data.width) attrs += ` width=${data.width}`;
            if (data.shape) attrs += ` shape=${data.shape}`;
            return `...image ${attrs}`;
        }
    },
    row: {
        title: '添加横向布局',
        fields: [
            { name: 'horizontal', label: '水平排列', type: 'select', options: ['Start', 'Center', 'End', 'SpaceEvenly', 'SpaceBetween', 'spacedBy(8)'], hint: '控制子元素的水平对齐方式' },
            { name: 'vertical', label: '垂直对齐', type: 'select', options: ['Top', 'Center', 'Bottom'] }
        ],
        template: (data) => {
            let attrs = '';
            if (data.horizontal) attrs += ` horizontal=${data.horizontal}`;
            if (data.vertical) attrs += ` vertical=${data.vertical}`;
            return `...row-start${attrs}\n    ...button text="按钮1" weight=(1)\n    ...button text="按钮2" weight=(1)\n...row-end`;
        }
    },
    column: {
        title: '添加纵向布局',
        fields: [
            { name: 'vertical', label: '垂直排列', type: 'select', options: ['Top', 'Center', 'Bottom', 'SpaceEvenly', 'spacedBy(8)'], hint: '控制子元素的垂直排列方式' },
            { name: 'horizontal', label: '水平对齐', type: 'select', options: ['Start', 'Center', 'End'] }
        ],
        template: (data) => {
            let attrs = '';
            if (data.vertical) attrs += ` vertical=${data.vertical}`;
            if (data.horizontal) attrs += ` horizontal=${data.horizontal}`;
            return `...column-start${attrs}\n    ...button text="按钮1"\n    ...button text="按钮2"\n...column-end`;
        }
    },
    divider: {
        title: '添加分割线',
        fields: [],
        template: () => '---'
    }
};

// ============ 打开组件配置弹窗 ============
function openComponentModal(componentType) {
    const template = componentTemplates[componentType];
    if (!template) return;
    
    pendingComponent = componentType;
    document.getElementById('modalTitle').textContent = template.title;
    
    // 生成表单
    let html = '';
    template.fields.forEach(field => {
        html += `<div class="form-group">`;
        html += `<label class="form-label">${field.label}${field.required ? ' <span style="color:#ef4444;">*</span>' : ''}</label>`;
        
        if (field.type === 'select') {
            html += `<select class="form-select" id="field_${field.name}">`;
            field.options.forEach(opt => {
                html += `<option value="${opt}">${opt}</option>`;
            });
            html += `</select>`;
        } else {
            html += `<input type="text" class="form-input" id="field_${field.name}" placeholder="${field.placeholder || ''}">`;
        }
        
        if (field.hint) {
            html += `<div class="form-hint">${field.hint}</div>`;
        }
        html += `</div>`;
    });
    
    if (template.fields.length === 0) {
        html = '<div class="form-hint">点击插入即可添加组件</div>';
    }
    
    document.getElementById('modalBody').innerHTML = html;
    document.getElementById('modalOverlay').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modalOverlay').style.display = 'none';
    pendingComponent = null;
}

function insertComponent() {
    if (!pendingComponent) return;
    
    const template = componentTemplates[pendingComponent];
    if (!template) return;
    
    // 收集表单数据
    const data = {};
    template.fields.forEach(field => {
        const input = document.getElementById(`field_${field.name}`);
        if (input) {
            data[field.name] = input.value;
        }
    });
    
    // 检查必填字段
    let missing = false;
    template.fields.forEach(field => {
        if (field.required && !data[field.name]) {
            showToast(`请填写 ${field.label}`);
            missing = true;
        }
    });
    if (missing) return;
    
    // 生成组件代码
    let componentCode = template.template(data);
    
    // 插入到光标位置或末尾
    const textarea = document.getElementById('editorTextarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    // 确保代码前后有换行
    let prefix = '';
    let suffix = '';
    if (start > 0 && text[start - 1] !== '\n') prefix = '\n';
    if (end < text.length && text[end] !== '\n') suffix = '\n';
    if (componentCode.endsWith('\n')) suffix = '';
    
    const newText = text.substring(0, start) + prefix + componentCode + suffix + text.substring(end);
    textarea.value = newText;
    
    // 更新 currentMarkdown 并刷新预览
    currentMarkdown = newText;
    renderPreview();
    
    closeModal();
    showToast(`✅ 已插入 ${template.title}`);
}

// ============ 帮助弹窗 ============
function openHelpModal() {
    document.getElementById('helpOverlay').style.display = 'flex';
}

function closeHelpModal() {
    document.getElementById('helpOverlay').style.display = 'none';
}

// ============ 解析自定义扩展组件（同之前） ============
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
    if (isEditMode) {
        document.getElementById('editorTextarea').value = content;
    }
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
        };
        reader.readAsText(file, 'UTF-8');
    };
    input.click();
}

function newFile() {
    const defaultContent = `// Zalith Launcher2 自定义主页
// 欢迎使用可视化编辑器！

# 🎮 我的游戏中心

...card-start title="快速开始"
这是一个示例卡片。你可以：
- 点击右侧的 **编辑模式** 开始修改
- 使用 **组件工具栏** 快速添加按钮、卡片、图片等

...button-filled-tonal text="点击测试" event="copy{Hello World!}"
...card-end

---
### 试试看

点击上方工具栏的 **编辑模式**，然后用中间的组件按钮插入新内容吧！
`;
    loadMarkdown(defaultContent, '新主页.md');
    showToast('✨ 已创建新文件');
}

// ============ 编辑模式 ============
function toggleEditMode() {
    const editArea = document.getElementById('editArea');
    const editBtn = document.getElementById('editModeBtn');
    const componentBar = document.getElementById('componentBar');
    
    if (isEditMode) {
        editArea.style.display = 'none';
        editBtn.textContent = '✏️ 编辑模式';
        isEditMode = false;
        showToast('已退出编辑模式');
    } else {
        editArea.style.display = 'flex';
        document.getElementById('editorTextarea').value = currentMarkdown;
        editBtn.textContent = '👁️ 预览模式';
        isEditMode = true;
        showToast('进入编辑模式，可使用组件工具栏快速插入');
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

// ============ 绑定组件按钮 ============
function bindComponentButtons() {
    const compBtns = document.querySelectorAll('.comp-btn');
    compBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const compType = btn.dataset.component;
            if (compType === 'help') {
                openHelpModal();
            } else if (componentTemplates[compType]) {
                if (!isEditMode) {
                    showToast('请先进入编辑模式再添加组件');
                    return;
                }
                openComponentModal(compType);
            } else {
                showToast('组件开发中...');
            }
        });
    });
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
    
    // 弹窗事件
    document.getElementById('modalCloseBtn').onclick = closeModal;
    document.getElementById('modalCancelBtn').onclick = closeModal;
    document.getElementById('modalConfirmBtn').onclick = insertComponent;
    document.getElementById('helpCloseBtn').onclick = closeHelpModal;
    document.getElementById('helpConfirmBtn').onclick = closeHelpModal;
    
    // 点击遮罩关闭
    document.getElementById('modalOverlay').onclick = (e) => {
        if (e.target === document.getElementById('modalOverlay')) closeModal();
    };
    document.getElementById('helpOverlay').onclick = (e) => {
        if (e.target === document.getElementById('helpOverlay')) closeHelpModal();
    };
    
    bindComponentButtons();
    
    // 尝试加载默认文件
    loadFromUrl('home_page.md').catch(() => {
        loadFromUrl('sample.md').catch(() => {
            newFile();
        });
    });
}

// 启动
init();