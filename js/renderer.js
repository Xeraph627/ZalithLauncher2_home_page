/**
 * 渲染器 - 将 Markdown + 扩展组件转为 HTML
 */

// 转义 HTML
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// 解析元组 (12) 或 (12, 8) 或 (4,4,12,12)
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

// 获取属性值
function getAttr(line, name) {
    const regex = new RegExp(`${name}=("([^"]*)"|([^\\s]+))`);
    const match = line.match(regex);
    return match ? (match[2] || match[3] || '') : '';
}

// 解析自定义组件
function parseCustomComponents(mdText) {
    const lines = mdText.split(/\r?\n/);
    let result = '';
    let inCode = false;
    const stack = [];
    let i = 0;

    while (i < lines.length) {
        let line = lines[i];
        const trimmed = line.trim();

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
                    else if (['small', 'medium', 'large'].includes(shape)) {
                        const map = { small: '8px', medium: '12px', large: '16px' };
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
            if (tag === 'row-start') { result += '<div class="custom-row">\n'; stack.push({ tag: 'row' }); i++; continue; }
            if (tag === 'column-start') { result += '<div class="custom-column">\n'; stack.push({ tag: 'column' }); i++; continue; }

            // 按钮
            if (['button', 'button-outlined', 'button-filled-tonal', 'button-text'].includes(tag)) {
                const text = getAttr(attrs, 'text');
                const eventVal = getAttr(attrs, 'event');
                const width = getAttr(attrs, 'width');
                
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
                const onClick = eventVal ? `onclick="window.handleEvent('${escapeHtml(eventVal).replace(/'/g, "\\'")}')"` : '';
                result += `<button class="${btnClass}" style="${style}" ${onClick}>${escapeHtml(text)}</button>`;
                i++;
                continue;
            }

            // 图片
            if (tag === 'image') {
                const url = getAttr(attrs, 'url');
                const width = getAttr(attrs, 'width');
                let style = '';
                if (width) {
                    if (width.endsWith('%')) style = `width: ${width};`;
                    else if (width.endsWith('dp')) style = `width: ${parseFloat(width)}px;`;
                }
                result += `<img class="custom-image" src="${escapeHtml(url)}" style="${style}" alt="image" onerror="this.src='https://placehold.co/400x200?text=加载失败'">`;
                i++;
                continue;
            }

            result += `<!-- 组件: ${tag} -->\n`;
            i++;
            continue;
        }

        result += line + '\n';
        i++;
    }

    // 保护 HTML 标签
    const placeholders = [];
    let processed = result.replace(/<div class="custom-[^"]+">|<\/div>|<button[^>]*>.*?<\/button>|<img[^>]*>/gs, (match) => {
        const idx = placeholders.length;
        placeholders.push(match);
        return `%%HTML_${idx}%%`;
    });

    let finalHtml = marked.parse(processed, { async: false });
    finalHtml = finalHtml.replace(/%%HTML_(\d+)%%/g, (_, idx) => placeholders[parseInt(idx)] || '');
    return finalHtml;
}

// 渲染预览
function renderPreview(content) {
    const previewDiv = document.getElementById('preview');
    if (!content) {
        previewDiv.innerHTML = '<div class="error">没有内容，请新建或上传文件</div>';
        return;
    }
    try {
        previewDiv.innerHTML = parseCustomComponents(content);
    } catch (e) {
        previewDiv.innerHTML = `<div class="error">解析错误: ${e.message}</div>`;
    }
}