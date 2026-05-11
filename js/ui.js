/**
 * UI 控制 - 弹窗、提示、模式切换
 */

// 显示提示
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}

// 预览/编辑模式切换
let isEditMode = false;

function togglePreviewMode() {
    const editPanel = document.getElementById('editPanel');
    const previewModeBtn = document.getElementById('previewModeBtn');
    const editModeBtn = document.getElementById('editModeBtn');
    const modeIndicator = document.getElementById('modeIndicator');
    
    if (isEditMode) {
        // 切换到预览模式
        if (editPanel) editPanel.remove();
        previewModeBtn.classList.add('active');
        editModeBtn.classList.remove('active');
        modeIndicator.textContent = '预览模式';
        setDragMode(false);
        isEditMode = false;
        showToast('已切换到预览模式');
    }
}

function toggleEditMode() {
    const mainArea = document.querySelector('.main-editor-area');
    const previewPanel = document.querySelector('.preview-panel');
    const previewModeBtn = document.getElementById('previewModeBtn');
    const editModeBtn = document.getElementById('editModeBtn');
    const modeIndicator = document.getElementById('modeIndicator');
    
    if (!isEditMode) {
        // 切换到编辑模式 - 添加编辑器面板
        const editPanel = document.createElement('div');
        editPanel.id = 'editPanel';
        editPanel.className = 'edit-panel';
        editPanel.style.flex = '1';
        editPanel.style.display = 'flex';
        editPanel.style.flexDirection = 'column';
        editPanel.style.background = '#0f1322';
        editPanel.style.borderRadius = '20px';
        editPanel.style.border = '1px solid #1e2440';
        editPanel.style.overflow = 'hidden';
        
        editPanel.innerHTML = `
            <div class="panel-header">
                <span>✏️ 源码编辑</span>
                <div class="panel-actions">
                    <button id="saveBtn" class="btn-small">💾 保存</button>
                    <button id="cancelBtn" class="btn-small">❌ 取消</button>
                </div>
            </div>
            <div class="component-bar">
                <div class="bar-title">📦 插入组件</div>
                <div class="component-list" id="componentList"></div>
            </div>
            <textarea id="editor" class="editor" placeholder="在这里编写 Markdown 源码..."></textarea>
            <div class="editor-hint">
                💡 提示：点击上方按钮可快速插入组件，也可在预览区拖拽调整
            </div>
        `;
        
        // 插入到预览面板旁边
        mainArea.insertBefore(editPanel, previewPanel.nextSibling);
        
        // 渲染组件按钮
        renderComponentBar();
        bindComponentButtons();
        
        // 设置编辑器内容
        document.getElementById('editor').value = window.currentMarkdown || '';
        document.getElementById('saveBtn').onclick = saveFromEditor;
        document.getElementById('cancelBtn').onclick = () => {
            const editor = document.getElementById('editor');
            if (editor && window.currentMarkdown) {
                editor.value = window.currentMarkdown;
                showToast('已取消修改');
            }
        };
        
        previewModeBtn.classList.remove('active');
        editModeBtn.classList.add('active');
        modeIndicator.textContent = '编辑模式 + 拖拽';
        setDragMode(true);
        isEditMode = true;
        showToast('进入编辑模式，可拖拽调整元素顺序，点击元素修改属性');
    }
}

// 渲染组件工具栏
function renderComponentBar() {
    const container = document.getElementById('componentList');
    if (!container) return;
    
    container.innerHTML = '';
    
    for (const category of COMPONENT_CATEGORIES) {
        const catTitle = document.createElement('div');
        catTitle.className = 'category-title';
        catTitle.textContent = category.name;
        container.appendChild(catTitle);
        
        for (const type of category.items) {
            if (ComponentTemplates[type]) {
                const btn = document.createElement('button');
                btn.className = 'comp-btn';
                btn.dataset.type = type;
                btn.textContent = getComponentDisplayName(type);
                btn.title = ComponentTemplates[type].name + (ComponentTemplates[type].note ? ' ' + ComponentTemplates[type].note : '');
                container.appendChild(btn);
            }
        }
    }
}

// 绑定组件按钮事件
function bindComponentButtons() {
    const btns = document.querySelectorAll('.comp-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.type;
            if (type === 'help') {
                openHelpModal();
            } else if (ComponentTemplates[type]) {
                openComponentModal(type);
            } else {
                showToast('组件开发中');
            }
        });
    });
}

// 打开组件配置弹窗
function openComponentModal(type) {
    const template = ComponentTemplates[type];
    if (!template) return;
    
    window.pendingComponent = type;
    document.getElementById('modalTitle').textContent = `添加 ${template.name}`;
    
    let html = '';
    if (template.note) {
        html += `<div style="background:#1e2440; padding:8px 12px; border-radius:8px; margin-bottom:16px; font-size:12px; color:#fbbf24;">💡 ${template.note}</div>`;
    }
    for (const field of template.fields) {
        html += `<div class="form-group">`;
        html += `<label class="form-label">${field.label}${field.required ? ' <span style="color:#ef4444;">*</span>' : ''}</label>`;
        
        if (field.type === 'select') {
            html += `<select class="form-select" id="field_${field.name}">`;
            for (const opt of field.options) {
                const selected = (field.default && opt === field.default) ? ' selected' : '';
                html += `<option value="${opt}"${selected}>${opt}</option>`;
            }
            html += `</select>`;
        } else if (field.type === 'textarea') {
            html += `<textarea class="form-textarea" id="field_${field.name}" placeholder="${field.placeholder || ''}" rows="4"></textarea>`;
        } else {
            html += `<input type="text" class="form-input" id="field_${field.name}" placeholder="${field.placeholder || ''}" value="${field.default || ''}">`;
        }
        
        if (field.hint) html += `<div class="form-hint">${field.hint}</div>`;
        html += `</div>`;
    }
    
    if (template.fields.length === 0) {
        html = '<div style="color:#7f8ea3;">点击插入即可添加组件</div>';
    }
    
    document.getElementById('modalBody').innerHTML = html;
    document.getElementById('modal').style.display = 'flex';
}

// 关闭弹窗
function closeModal() {
    document.getElementById('modal').style.display = 'none';
    window.pendingComponent = null;
}

// 插入组件到编辑器
function insertComponent() {
    if (!window.pendingComponent) return;
    
    const template = ComponentTemplates[window.pendingComponent];
    if (!template) return;
    
    const data = {};
    for (const field of template.fields) {
        const input = document.getElementById(`field_${field.name}`);
        if (input) data[field.name] = input.value;
    }
    
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
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    let prefix = '';
    let suffix = '';
    if (start > 0 && text[start - 1] !== '\n') prefix = '\n';
    if (end < text.length && text[end] !== '\n') suffix = '\n';
    
    const newText = text.substring(0, start) + prefix + code + suffix + text.substring(end);
    textarea.value = newText;
    
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

// 绑定弹窗关闭
function bindModalEvents() {
    document.getElementById('modalClose').onclick = closeModal;
    document.getElementById('modalCancel').onclick = closeModal;
    document.getElementById('modalConfirm').onclick = insertComponent;
    document.getElementById('helpClose').onclick = closeHelpModal;
    document.getElementById('helpConfirm').onclick = closeHelpModal;
    
    document.getElementById('modal').onclick = (e) => {
        if (e.target === document.getElementById('modal')) closeModal();
    };
    document.getElementById('helpModal').onclick = (e) => {
        if (e.target === document.getElementById('helpModal')) closeHelpModal();
    };
}

// 作者页面跳转
function openAuthorPage() {
    window.open('https://ssbtt114514.github.io/', '_blank');
    showToast('正在打开作者主页...');
}

// 绑定底部菜单按钮
function bindMenuButtons() {
    document.getElementById('previewModeBtn').onclick = togglePreviewMode;
    document.getElementById('editModeBtn').onclick = toggleEditMode;
    document.getElementById('newFileBtn').onclick = newFile;
    document.getElementById('uploadBtn').onclick = uploadFile;
    document.getElementById('downloadBtn').onclick = downloadFile;
    document.getElementById('refreshBtn').onclick = () => {
        if (window.currentMarkdown) {
            renderPreview(window.currentMarkdown);
            showToast('已刷新预览');
        } else {
            forceRefresh();
        }
    };
    document.getElementById('authorBtn').onclick = openAuthorPage;
    document.getElementById('closePropertyBtn').onclick = closePropertyPanel;
}