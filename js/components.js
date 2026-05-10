/**
 * 组件模板库 - 定义所有可插入的组件
 */

const ComponentTemplates = {
    // 卡片
    card: {
        name: '卡片',
        fields: [
            { name: 'title', label: '卡片标题', type: 'text', placeholder: '例如：我的卡片', hint: '可选，留空则不显示标题' },
            { name: 'shape', label: '圆角大小', type: 'select', options: ['medium', 'small', 'large', '12dp', '20%'] },
            { name: 'padding', label: '内边距', type: 'text', placeholder: '(16, 12)', hint: '格式：(全部) 或 (左右, 上下)' }
        ],
        template: (data) => {
            let attrs = '';
            if (data.title) attrs += ` title="${data.title}"`;
            if (data.shape && data.shape !== 'medium') attrs += ` shape=${data.shape}`;
            if (data.padding) attrs += ` contentPadding=${data.padding}`;
            return `...card-start${attrs}\n这里写卡片内容\n...card-end`;
        }
    },
    // 填充按钮
    button_filled: {
        name: '填充按钮',
        fields: [
            { name: 'text', label: '按钮文字', type: 'text', required: true, placeholder: '例如：点击我' },
            { name: 'event', label: '点击事件', type: 'select', options: ['url{https://}', 'copy{文本}', 'launch_game', 'check_update'] },
            { name: 'width', label: '宽度', type: 'text', placeholder: '留空为自动', hint: '例如：50% 或 120dp' }
        ],
        template: (data) => {
            let ev = data.event;
            if (ev === 'url{https://}') ev = 'url{https://example.com}';
            if (ev === 'copy{文本}') ev = 'copy{要复制的文字}';
            let attrs = `text="${data.text}" event="${ev}"`;
            if (data.width && data.width.trim()) attrs += ` width=${data.width}`;
            return `...button ${attrs}`;
        }
    },
    // 边框按钮
    button_outlined: {
        name: '边框按钮',
        fields: [
            { name: 'text', label: '按钮文字', type: 'text', required: true, placeholder: '例如：了解更多' },
            { name: 'event', label: '点击事件', type: 'select', options: ['url{https://}', 'copy{文本}', 'launch_game', 'check_update'] }
        ],
        template: (data) => {
            let ev = data.event;
            if (ev === 'url{https://}') ev = 'url{https://example.com}';
            if (ev === 'copy{文本}') ev = 'copy{要复制的文字}';
            return `...button-outlined text="${data.text}" event="${ev}"`;
        }
    },
    // 柔和按钮
    button_tonal: {
        name: '柔和按钮',
        fields: [
            { name: 'text', label: '按钮文字', type: 'text', required: true, placeholder: '例如：确认' },
            { name: 'event', label: '点击事件', type: 'select', options: ['url{https://}', 'copy{文本}', 'launch_game'] }
        ],
        template: (data) => {
            let ev = data.event;
            if (ev === 'url{https://}') ev = 'url{https://example.com}';
            if (ev === 'copy{文本}') ev = 'copy{要复制的文字}';
            return `...button-filled-tonal text="${data.text}" event="${ev}"`;
        }
    },
    // 文字按钮
    button_text: {
        name: '文字按钮',
        fields: [
            { name: 'text', label: '按钮文字', type: 'text', required: true, placeholder: '例如：查看详情' },
            { name: 'event', label: '点击事件', type: 'select', options: ['url{https://}', 'copy{文本}'] }
        ],
        template: (data) => {
            let ev = data.event;
            if (ev === 'url{https://}') ev = 'url{https://example.com}';
            if (ev === 'copy{文本}') ev = 'copy{要复制的文字}';
            return `...button-text text="${data.text}" event="${ev}"`;
        }
    },
    // 图片
    image: {
        name: '图片',
        fields: [
            { name: 'url', label: '图片链接', type: 'text', required: true, placeholder: 'https://example.com/image.jpg', hint: '必填，支持网络图片' },
            { name: 'width', label: '宽度', type: 'text', placeholder: '100%', hint: '例如：50% 或 200dp' }
        ],
        template: (data) => {
            let attrs = `url="${data.url}"`;
            if (data.width && data.width.trim()) attrs += ` width=${data.width}`;
            return `...image ${attrs}`;
        }
    },
    // 横向布局
    row: {
        name: '横向布局',
        fields: [
            { name: 'spacing', label: '间距', type: 'text', placeholder: '8', hint: '子元素之间的间距(px)' },
            { name: 'align', label: '垂直对齐', type: 'select', options: ['Top', 'Center', 'Bottom'] }
        ],
        template: (data) => {
            let attrs = '';
            if (data.spacing) attrs = ` horizontal=spacedBy(${data.spacing})`;
            if (data.align && data.align !== 'Top') attrs += ` vertical=${data.align}`;
            return `...row-start${attrs}\n    ...button text="按钮1" weight=(1)\n    ...button text="按钮2" weight=(1)\n...row-end`;
        }
    },
    // 纵向布局
    column: {
        name: '纵向布局',
        fields: [
            { name: 'spacing', label: '间距', type: 'text', placeholder: '8', hint: '子元素之间的间距(px)' },
            { name: 'align', label: '水平对齐', type: 'select', options: ['Start', 'Center', 'End'] }
        ],
        template: (data) => {
            let attrs = '';
            if (data.spacing) attrs = ` vertical=spacedBy(${data.spacing})`;
            if (data.align && data.align !== 'Start') attrs += ` horizontal=${data.align}`;
            return `...column-start${attrs}\n    ...button text="按钮1"\n    ...button text="按钮2"\n...column-end`;
        }
    },
    // 分割线
    divider: {
        name: '分割线',
        fields: [],
        template: () => '\n---\n'
    }
};

// 帮助内容
const HelpContent = `
<h3>📦 卡片组件</h3>
<pre><code>...card-start title="标题" shape=medium
内容...
...card-end</code></pre>

<h3>🔘 按钮组件</h3>
<pre><code>...button text="按钮文字" event="url{https://example.com}"
...button-outlined text="边框按钮" event="copy{文本}"
...button-filled-tonal text="柔和按钮" event="launch_game"
...button-text text="文字按钮" event="url{https://}"</code></pre>

<h3>🖼️ 图片组件</h3>
<pre><code>...image url="https://example.com/image.jpg" width=50%</code></pre>

<h3>↔️ 布局组件</h3>
<pre><code>...row-start horizontal=spacedBy(8)
    ...button text="按钮1" weight=(1)
    ...button text="按钮2" weight=(1)
...row-end</code></pre>

<h3>📋 支持的事件</h3>
<ul>
<li><code>url{https://...}</code> - 打开链接</li>
<li><code>copy{文字}</code> - 复制文字</li>
<li><code>launch_game</code> - 启动游戏</li>
<li><code>check_update</code> - 检查更新</li>
</ul>
`;

// 当前等待插入的组件
let pendingComponent = null;

// 打开组件配置弹窗
function openComponentModal(type) {
    const template = ComponentTemplates[type];
    if (!template) return;
    
    pendingComponent = type;
    document.getElementById('modalTitle').textContent = `添加 ${template.name}`;
    
    let html = '';
    for (const field of template.fields) {
        html += `<div class="form-group">`;
        html += `<label class="form-label">${field.label}${field.required ? ' <span style="color:#ef4444;">*</span>' : ''}</label>`;
        
        if (field.type === 'select') {
            html += `<select class="form-select" id="field_${field.name}">`;
            for (const opt of field.options) {
                html += `<option value="${opt}">${opt}</option>`;
            }
            html += `</select>`;
        } else {
            html += `<input type="text" class="form-input" id="field_${field.name}" placeholder="${field.placeholder || ''}">`;
        }
        
        if (field.hint) html += `<div class="form-hint">${field.hint}</div>`;
        html += `</div>`;
    }
    
    if (template.fields.length === 0) {
        html = '<div style="color:#7f8ea3;">点击插入即可添加分割线</div>';
    }
    
    document.getElementById('modalBody').innerHTML = html;
    document.getElementById('modal').style.display = 'flex';
}

// 关闭弹窗
function closeModal() {
    document.getElementById('modal').style.display = 'none';
    pendingComponent = null;
}

// 插入组件到编辑器
function insertComponent() {
    if (!pendingComponent) return;
    
    const template = ComponentTemplates[pendingComponent];
    if (!template) return;
    
    const data = {};
    for (const field of template.fields) {
        const input = document.getElementById(`field_${field.name}`);
        if (input) data[field.name] = input.value;
    }
    
    // 检查必填
    for (const field of template.fields) {
        if (field.required && !data[field.name]) {
            showToast(`请填写 ${field.label}`);
            return;
        }
    }
    
    const code = template.template(data);
    insertAtCursor(code);
    closeModal();
    showToast(`已添加 ${template.name}`);
}

// 在光标位置插入代码
function insertAtCursor(code) {
    const textarea = document.getElementById('editor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    let prefix = (start > 0 && text[start - 1] !== '\n') ? '\n' : '';
    let suffix = (end < text.length && text[end] !== '\n') ? '\n' : '';
    
    const newText = text.substring(0, start) + prefix + code + suffix + text.substring(end);
    textarea.value = newText;
    
    // 更新全局内容并刷新预览
    window.currentMarkdown = newText;
    renderPreview(newText);
}

// 打开帮助
function openHelpModal() {
    document.getElementById('helpBody').innerHTML = `<div class="help-body">${HelpContent}</div>`;
    document.getElementById('helpModal').style.display = 'flex';
}

function closeHelpModal() {
    document.getElementById('helpModal').style.display = 'none';
}

// 全局事件处理（供预览按钮使用）
window.handleEvent = function(eventStr) {
    const urlMatch = eventStr.match(/url\{\s*(.*?)\s*\}/);
    if (urlMatch) {
        window.open(urlMatch[1], '_blank');
        return;
    }
    const copyMatch = eventStr.match(/copy\{\s*(.*?)\s*\}/);
    if (copyMatch) {
        navigator.clipboard.writeText(copyMatch[1]);
        showToast(`📋 已复制: ${copyMatch[1].substring(0, 30)}${copyMatch[1].length > 30 ? '...' : ''}`);
        return;
    }
    if (eventStr === 'launch_game') showToast('🎮 启动游戏');
    else if (eventStr === 'check_update') showToast('🔄 检查更新');
    else showToast(`事件: ${eventStr}`);
};