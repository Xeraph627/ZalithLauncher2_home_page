/**
 * 拖拽编辑器 - 支持长按拖拽（移动端）/ 鼠标拖拽（PC端）
 */

let selectedElement = null;
let isDragMode = false;
let longPressTimer = null;
let isDragging = false;
let sortableInstance = null;

// 初始化拖拽功能
function initDragAndDrop() {
    const previewDiv = document.getElementById('preview');
    
    // 使用 SortableJS，配置长按触发
    sortableInstance = new Sortable(previewDiv, {
        animation: 300,
        handle: '.draggable-element',
        draggable: '.draggable-element',
        delay: 500,  // 长按 500ms 触发拖拽
        delayOnTouchOnly: true,  // 只在触摸设备上延迟
        touchStartThreshold: 3,
        onStart: function() {
            isDragging = true;
            if (longPressTimer) clearTimeout(longPressTimer);
        },
        onEnd: function() {
            isDragging = false;
            updateSourceFromDOM();
        },
        onChoose: function(evt) {
            // 添加视觉反馈
            evt.item.classList.add('long-press');
        },
        onUnchoose: function(evt) {
            evt.item.classList.remove('long-press');
        }
    });
    
    // 点击选中元素（PC 单击 / 移动端触摸后不拖拽时）
    previewDiv.addEventListener('click', (e) => {
        if (!isDragMode) return;
        if (isDragging) return; // 拖拽中不触发选中
        
        let target = e.target;
        while (target && target !== previewDiv) {
            if (target.classList && target.classList.contains('draggable-element')) {
                selectElement(target);
                break;
            }
            target = target.parentElement;
        }
    });
    
    // 移动端：触摸结束时清除长按计时器
    previewDiv.addEventListener('touchstart', (e) => {
        if (!isDragMode) return;
        longPressTimer = setTimeout(() => {
            // 长按触发拖拽，SortableJS 会处理
        }, 500);
    });
    
    previewDiv.addEventListener('touchend', () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
        isDragging = false;
    });
}

// 选中元素
function selectElement(element) {
    if (selectedElement) {
        selectedElement.classList.remove('selected');
    }
    selectedElement = element;
    selectedElement.classList.add('selected');
    showPropertyPanel(element);
}

// 显示属性面板
function showPropertyPanel(element) {
    const panel = document.getElementById('propertyPanel');
    const content = document.getElementById('propertyContent');
    
    const elementInfo = getElementInfo(element);
    
    let html = `
        <div class="prop-group">
            <label>类型</label>
            <input class="prop-input" value="${elementInfo.type}" disabled>
        </div>
        <div class="prop-group">
            <label>文字</label>
            <input type="text" id="prop_text" class="prop-input" value="${escapeHtml(elementInfo.text || '')}">
        </div>
        <div class="prop-group">
            <label>宽度</label>
            <div class="prop-slider-row">
                <input type="range" id="prop_width_slider" class="prop-slider" min="0" max="100" step="1" value="${parseInt(elementInfo.width) || 0}">
                <input type="text" id="prop_width" class="prop-slider-value" value="${elementInfo.width || 'auto'}">
            </div>
        </div>
        <div class="prop-group">
            <label>圆角</label>
            <div class="prop-slider-row">
                <input type="range" id="prop_radius_slider" class="prop-slider" min="0" max="32" step="1" value="${parseInt(elementInfo.radius) || 8}">
                <input type="text" id="prop_radius" class="prop-slider-value" value="${elementInfo.radius || '12px'}">
            </div>
        </div>
    `;
    
    if (elementInfo.type === '按钮' && elementInfo.event !== undefined) {
        html += `
        <div class="prop-group">
            <label>事件</label>
            <select id="prop_event" class="prop-select">
                <option value="url {https://}" ${elementInfo.event === 'url {https://}' ? 'selected' : ''}>打开链接</option>
                <option value="copy {}" ${elementInfo.event === 'copy {}' ? 'selected' : ''}>复制文本</option>
                <option value="launch_game" ${elementInfo.event === 'launch_game' ? 'selected' : ''}>启动游戏</option>
                <option value="check_update" ${elementInfo.event === 'check_update' ? 'selected' : ''}>检查更新</option>
            </select>
        </div>
        `;
    }
    
    if (elementInfo.type === '图片' && elementInfo.url !== undefined) {
        html += `
        <div class="prop-group">
            <label>图片链接</label>
            <input type="text" id="prop_url" class="prop-input" value="${escapeHtml(elementInfo.url || '')}">
        </div>
        `;
    }
    
    html += `
        <div class="prop-group">
            <button id="applyChangesBtn" class="btn-primary" style="width:100%">应用</button>
        </div>
        <div class="prop-group">
            <button id="deleteElementBtn" class="btn-secondary" style="width:100%; background:#7f1a1a;">删除</button>
        </div>
    `;
    
    content.innerHTML = html;
    
    // 显示面板（移动端从底部滑出）
    panel.classList.add('open');
    panel.style.display = 'flex';
    
    // 绑定事件
    document.getElementById('applyChangesBtn').onclick = () => applyChanges(element);
    document.getElementById('deleteElementBtn').onclick = () => deleteElement(element);
    
    // 滑块同步
    const widthSlider = document.getElementById('prop_width_slider');
    const widthInput = document.getElementById('prop_width');
    if (widthSlider && widthInput) {
        widthSlider.oninput = () => { widthInput.value = widthSlider.value + '%'; };
        widthInput.onchange = () => {
            let val = widthInput.value;
            if (val.endsWith('%')) widthSlider.value = parseInt(val);
            else if (val.endsWith('px')) widthSlider.value = parseInt(val);
            else if (!isNaN(val)) widthSlider.value = parseInt(val);
        };
    }
    
    const radiusSlider = document.getElementById('prop_radius_slider');
    const radiusInput = document.getElementById('prop_radius');
    if (radiusSlider && radiusInput) {
        radiusSlider.oninput = () => { radiusInput.value = radiusSlider.value + 'px'; };
        radiusInput.onchange = () => {
            let val = radiusInput.value;
            if (val.endsWith('px')) radiusSlider.value = parseInt(val);
            else if (!isNaN(val)) radiusSlider.value = parseInt(val);
        };
    }
}

// 获取元素信息
function getElementInfo(element) {
    let type = '未知', text = '', width = '', radius = '', event = '', url = '';
    
    if (element.classList.contains('btn')) {
        type = '按钮';
        text = element.textContent;
        width = element.style.width || 'auto';
        radius = element.style.borderRadius || '24px';
        const onclick = element.getAttribute('onclick');
        if (onclick) {
            const match = onclick.match(/handleEvent\('(.+?)'\)/);
            if (match) event = match[1];
        }
    } else if (element.classList.contains('custom-image')) {
        type = '图片';
        width = element.style.width || '100%';
        radius = element.style.borderRadius || '0px';
        url = element.src;
    } else if (element.classList.contains('custom-card')) {
        type = '卡片';
        radius = element.style.borderRadius || '12px';
        const titleEl = element.querySelector('.card-title');
        if (titleEl) text = titleEl.textContent;
    }
    
    return { type, text, width, radius, event, url };
}

// 应用更改
function applyChanges(element) {
    const info = getElementInfo(element);
    
    if (info.type === '按钮') {
        const newText = document.getElementById('prop_text')?.value || element.textContent;
        const newWidth = document.getElementById('prop_width')?.value || info.width;
        const newRadius = document.getElementById('prop_radius')?.value || info.radius;
        const newEvent = document.getElementById('prop_event')?.value || info.event;
        
        element.textContent = newText;
        element.style.width = newWidth;
        element.style.borderRadius = newRadius;
        if (newEvent) {
            element.setAttribute('onclick', `window.handleEvent('${newEvent.replace(/'/g, "\\'")}')`);
        }
    } else if (info.type === '图片') {
        const newWidth = document.getElementById('prop_width')?.value || info.width;
        const newRadius = document.getElementById('prop_radius')?.value || info.radius;
        const newUrl = document.getElementById('prop_url')?.value || info.url;
        
        element.style.width = newWidth;
        element.style.borderRadius = newRadius;
        if (newUrl) element.src = newUrl;
    } else if (info.type === '卡片') {
        const newRadius = document.getElementById('prop_radius')?.value || info.radius;
        element.style.borderRadius = newRadius;
    }
    
    updateSourceFromDOM();
    showToast('已应用');
}

// 删除元素
function deleteElement(element) {
    element.remove();
    updateSourceFromDOM();
    closePropertyPanel();
    showToast('已删除');
}

// 更新源码
function updateSourceFromDOM() {
    // 简化：提示用户手动保存
    if (document.getElementById('editor')) {
        showToast('修改已应用，请点击保存按钮');
    }
}

// 关闭属性面板
function closePropertyPanel() {
    const panel = document.getElementById('propertyPanel');
    panel.classList.remove('open');
    setTimeout(() => {
        panel.style.display = 'none';
    }, 300);
    if (selectedElement) {
        selectedElement.classList.remove('selected');
        selectedElement = null;
    }
}

// 切换拖拽模式
function setDragMode(enabled) {
    isDragMode = enabled;
    const previewDiv = document.getElementById('preview');
    
    if (enabled) {
        document.querySelectorAll('.btn, .custom-card, .custom-image, .custom-row, .custom-column').forEach(el => {
            el.classList.add('draggable-element');
        });
        showToast('长按元素可拖拽排序，点击可修改属性');
    } else {
        document.querySelectorAll('.draggable-element').forEach(el => {
            el.classList.remove('draggable-element');
        });
        closePropertyPanel();
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}