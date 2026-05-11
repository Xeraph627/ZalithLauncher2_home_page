/**
 * 渲染器 - 将 Markdown + 扩展组件转为 HTML
 */

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

function getAttr(line, name) {
    const regex = new RegExp(`${name}=("([^"]*)"|([^\\s]+))`);
    const match = line.match(regex);
    return match ? (match[2] || match[3] || '') : '';
}

function parseCustomComponents(mdText) {
    const lines = mdText.split(/\r?\n/);
    let result = '';
    let inCode = false;
    const stack = [];
    let i = 0;

    while (i < lines.length) {
        let line = lines[i];
        const trimmed = line.trim();

        // 代码块
        if (trimmed.startsWith('```')) {
            inCode = !inCode;
            result += line + '\n';
            i++;
            continue;
        }
        
        if (inCode || trimmed.startsWith('//')) {
            result += line + '\n';
            i++;
            continue;
        }

        // 检测扩展组件
        const match = trimmed.match(/^\.\.\.([a-z-]+)(?:\s+(.*))?$/);
        if (match) {
            const tag = match[1];
            const attrs = match[2] || '';

            // 结束标签
            if (tag.endsWith('-end')) {
                const openTag = tag.replace('-end', '');
                if (stack.length && stack[stack.length - 1].tag === openTag) {
                    stack.pop();
                    if (openTag === 'card') result += '</div></div>\n';
                    else if (openTag === 'row') result += '</div>\n';
                    else if (openTag === 'column') result += '</div>\n';
                }
                i++;
                continue;
            }

            // 卡片
            if (tag === 'card-start') {
                const title = getAttr(attrs, 'title');
                let style = '';
                const shape = getAttr(attrs, 'shape');
                if (shape) {
                    if (shape.endsWith('dp')) style = `border-radius: ${parseFloat(shape)}px;`;
                    else if (shape.endsWith('%')) style = `border-radius: ${shape};`;
                    else if (['extraSmall', 'small', 'medium', 'large', 'extraLarge'].includes(shape)) {
                        const map = { extraSmall: '4px', small: '8px', medium: '12px', large: '16px', extraLarge: '24px' };
                        style = `border-radius: ${map[shape] || '12px'};`;
                    }
                }
                let html = `<div class="custom-card" style="${style}">`;
                if (title) html += `<div class="card-title">${escapeHtml(title)}</div>`;
                html += `<div class="card-content">`;
                result += html;
                stack.push({ tag: 'card' });
                i++;
                continue;
            }

            // 布局
            if (tag === 'row-start') {
                result += '<div class="custom-row">\n';
                stack.push({ tag: 'row' });
                i++;
                continue;
            }
            
            if (tag === 'column-start') {
                result += '<div class="custom-column">\n';
                stack.push({ tag: 'column' });
                i++;
                continue;
            }

            // 按钮
            if (['button', 'button-outlined', 'button-filled-tonal', 'button-text'].includes(tag)) {
                const text = getAttr(attrs, 'text');
                const eventVal = getAttr(attrs, 'event');
                const width = getAttr(attrs, 'width');
                const shape = getAttr(attrs, 'shape');
                
                let btnClass = 'btn';
                if (tag === 'button') btnClass += ' btn-filled';
                else if (tag === 'button-outlined') btnClass += ' btn-outlined';
                else if (tag === 'button-filled-tonal') btnClass += ' btn-filled-tonal';
                else if (tag === 'button-text') btnClass += ' btn-text';
                
                let style = '';
                if (width) {
                    if (width.endsWith('%')) style = `width: ${width};`;
                    else if (width.endsWith('dp')) style = `width: ${parseFloat(width)}px;`;
                }
                if (shape) {
                    if (shape.endsWith('dp')) style += `border-radius: ${parseFloat(shape)}px;`;
                    else if (shape.endsWith('%')) style += `border-radius: ${shape};`;
                }
                const onClick = eventVal ? `onclick="window.handleEvent('${escapeHtml(eventVal).replace(/'/g, "\\'")}')"` : '';
                result += `<button class="${btnClass}" style="${style}" ${onClick}>${escapeHtml(text)}</button>\n`;
                i++;
                continue;
            }

            // 图片
            if (tag === 'image') {
                const url = getAttr(attrs, 'url');
                const width = getAttr(attrs, 'width');
                const shape = getAttr(attrs, 'shape');
                let style = '';
                if (width) {
                    if (width.endsWith('%')) style = `width: ${width};`;
                    else if (width.endsWith('dp')) style = `width: ${parseFloat(width)}px;`;
                }
                if (shape) {
                    if (shape.endsWith('dp')) style += `border-radius: ${parseFloat(shape)}px;`;
                    else if (shape.endsWith('%')) style += `border-radius: ${shape};`;
                }
                result += `<img class="custom-image" src="${escapeHtml(url)}" style="${style}" alt="image" loading="lazy" onerror="this.src='https://placehold.co/400x200?text=加载失败'">\n`;
                i++;
                continue;
            }

            result += `<!-- ${tag} -->\n`;
            i++;
            continue;
        }

        // 普通文本行
        result += line + '\n';
        i++;
    }

    // 关闭未闭合标签
    while (stack.length) {
        const item = stack.pop();
        if (item.tag === 'card') result += '</div></div>\n';
        else if (item.tag === 'row') result += '</div>\n';
        else if (item.tag === 'column') result += '</div>\n';
    }

    // 保护 HTML 标签
    const placeholders = [];
    let processed = result.replace(/<div class="custom-card[^>]*>|<\/div>|<div class="card-title">.*?<\/div>|<div class="card-content">|<div class="custom-row">|<div class="custom-column">|<button[^>]*>.*?<\/button>|<img[^>]*>/gs, (match) => {
        const idx = placeholders.length;
        placeholders.push(match);
        return `%%HTML_${idx}%%`;
    });

    // 使用 marked 解析 Markdown（这会正确处理 --- 分隔符）
    let finalHtml = marked.parse(processed, { async: false });
    
    // 恢复被保护的 HTML 标签
    finalHtml = finalHtml.replace(/%%HTML_(\d+)%%/g, (_, idx) => placeholders[parseInt(idx)] || '');
    
    // 修复可能的多余分隔符：将连续的 <hr> 合并或清理
    finalHtml = finalHtml.replace(/<hr>\s*<hr>/g, '<hr>');
    
    return finalHtml;
}

function renderPreview(content) {
    const previewDiv = document.getElementById('preview');
    if (!content) {
        previewDiv.innerHTML = '<div class="error">没有内容</div>';
        return;
    }
    try {
        const html = parseCustomComponents(content);
        previewDiv.innerHTML = html;
        
        // 编辑模式下重新初始化拖拽
        if (window.isEditMode) {
            setTimeout(() => setDragMode(true), 100);
        }
    } catch (e) {
        console.error('渲染错误:', e);
        previewDiv.innerHTML = `<div class="error">解析错误: ${e.message}</div>`;
    }
}

// 事件处理
window.handleEvent = function(eventStr) {
    const urlMatch = eventStr.match(/url\s*\{\s*(.*?)\s*\}/);
    if (urlMatch) {
        window.open(urlMatch[1], '_blank');
        showToast(`🔗 ${urlMatch[1]}`);
        return;
    }
    const copyMatch = eventStr.match(/copy\s*\{\s*(.*?)\s*\}/);
    if (copyMatch) {
        navigator.clipboard.writeText(copyMatch[1]);
        showToast(`📋 已复制`);
        return;
    }
    if (eventStr === 'launch_game') showToast('🎮 启动游戏');
    else if (eventStr === 'check_update') showToast('🔄 检查更新');
    else showToast(`⚡ ${eventStr}`);
};

window.parseCustomComponents = parseCustomComponents;
window.renderPreview = renderPreview;