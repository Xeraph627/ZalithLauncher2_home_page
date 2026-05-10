/**
 * 组件模板库 - 严格按照 Zalith Launcher2 教程规范
 * 
 * 规范要点：
 * 1. 事件格式：event="url {https://...}" 中间有空格
 * 2. 权重格式：weight=(1) 带括号
 * 3. 组件成对出现：...card-start / ...card-end
 * 4. 属性值类型：text用双引号，数值直接写
 */

// 圆角选项（严格按照教程）
const SHAPE_OPTIONS = ['extraSmall', 'small', 'medium', 'large', 'extraLarge', '12dp', '20%', '50%'];

// 事件选项（严格按照教程 - event="url {https://}" 格式）
const EVENT_OPTIONS = [
    'url {https://}',
    'copy {}', 
    'launch_game',
    'check_update'
];

// 水平排列选项（严格按照教程）
const HORIZONTAL_ARRANGEMENT = ['Start', 'Center', 'End', 'SpaceEvenly', 'SpaceBetween', 'SpaceAround'];
const SPACED_BY_OPTIONS = ['spacedBy(8)', 'spacedBy(12)', 'spacedBy(8, Start)', 'spacedBy(8, Center)', 'spacedBy(8, End)'];

// 垂直对齐选项
const VERTICAL_ALIGN = ['Top', 'Center', 'Bottom'];

// 所有组件模板
const ComponentTemplates = {
    // ==================== 容器组件 ====================
    card: {
        name: '卡片容器',
        icon: '📦',
        category: '容器',
        note: '⚠️ 卡片不能放在 Row/Column 内部',
        fields: [
            { name: 'title', label: '卡片标题', type: 'text', placeholder: '例如：我的卡片', hint: '可选，不存在或不填写时，卡片会不显示标题块' },
            { name: 'shape', label: '圆角大小', type: 'select', options: SHAPE_OPTIONS, default: 'medium', hint: '支持预设或自定义数值(如12dp)或百分比(如20%)' },
            { name: 'padding', label: '内边距', type: 'text', placeholder: '(16, 12)', hint: '格式：(all) 或 (horizontal, vertical) 或 (left, top, right, bottom)，单位dp' }
        ],
        template: (data) => {
            let attrs = '';
            if (data.title) attrs += ` title="${data.title}"`;
            if (data.shape && data.shape !== 'medium') attrs += ` shape=${data.shape}`;
            if (data.padding) attrs += ` contentPadding=${data.padding}`;
            return `...card-start${attrs}\n\n  这里是卡片内部的内容，支持标准 **Markdown**\n\n...card-end`;
        }
    },

    // ==================== 按钮组件（4种样式 - 严格按照教程） ====================
    button_filled: {
        name: '填充按钮 (...button)',
        icon: '🔵',
        category: '按钮',
        syntax: '...button text="按钮文字" event="url {https://}"',
        fields: [
            { name: 'text', label: '按钮文字', type: 'text', required: true, placeholder: '例如：访问哔哩哔哩' },
            { name: 'event', label: '点击事件', type: 'select', options: EVENT_OPTIONS, default: 'url {https://}', hint: 'url{...} 打开链接，copy{...} 复制内容，launch_game 启动游戏，check_update 检查更新' },
            { name: 'width', label: '宽度', type: 'text', placeholder: '留空为自动', hint: '例如：50% 或 120dp' },
            { name: 'shape', label: '圆角', type: 'select', options: SHAPE_OPTIONS, placeholder: '留空为默认' }
        ],
        template: (data) => {
            let ev = data.event || 'url {https://}';
            if (ev === 'url {https://}') ev = 'url {https://www.example.com}';
            if (ev === 'copy {}') ev = 'copy {要复制的文字}';
            let attrs = `text="${data.text}" event="${ev}"`;
            if (data.width && data.width.trim()) attrs += ` width=${data.width}`;
            if (data.shape && data.shape.trim()) attrs += ` shape=${data.shape}`;
            return `...button ${attrs}`;
        }
    },
    
    button_outlined: {
        name: '边框按钮 (...button-outlined)',
        icon: '🔲',
        category: '按钮',
        syntax: '...button-outlined text="按钮文字" event="check_update"',
        fields: [
            { name: 'text', label: '按钮文字', type: 'text', required: true, placeholder: '例如：检查更新' },
            { name: 'event', label: '点击事件', type: 'select', options: EVENT_OPTIONS, default: 'check_update' },
            { name: 'width', label: '宽度', type: 'text', placeholder: '留空为自动', hint: '例如：50% 或 120dp' },
            { name: 'shape', label: '圆角', type: 'select', options: SHAPE_OPTIONS, placeholder: '留空为默认' }
        ],
        template: (data) => {
            let ev = data.event || 'check_update';
            if (ev === 'url {https://}') ev = 'url {https://www.example.com}';
            if (ev === 'copy {}') ev = 'copy {要复制的文字}';
            let attrs = `text="${data.text}" event="${ev}"`;
            if (data.width && data.width.trim()) attrs += ` width=${data.width}`;
            if (data.shape && data.shape.trim()) attrs += ` shape=${data.shape}`;
            return `...button-outlined ${attrs}`;
        }
    },
    
    button_tonal: {
        name: '色调按钮 (...button-filled-tonal)',
        icon: '🎨',
        category: '按钮',
        syntax: '...button-filled-tonal text="按钮文字"',
        fields: [
            { name: 'text', label: '按钮文字', type: 'text', required: true, placeholder: '例如：色调填充样式' },
            { name: 'event', label: '点击事件', type: 'select', options: EVENT_OPTIONS, default: 'url {https://}' },
            { name: 'width', label: '宽度', type: 'text', placeholder: '留空为自动' }
        ],
        template: (data) => {
            let ev = data.event || 'url {https://}';
            if (ev === 'url {https://}') ev = 'url {https://www.example.com}';
            if (ev === 'copy {}') ev = 'copy {要复制的文字}';
            let attrs = `text="${data.text}" event="${ev}"`;
            if (data.width && data.width.trim()) attrs += ` width=${data.width}`;
            return `...button-filled-tonal ${attrs}`;
        }
    },
    
    button_text: {
        name: '文字按钮 (...button-text)',
        icon: '📝',
        category: '按钮',
        syntax: '...button-text text="按钮文字"',
        fields: [
            { name: 'text', label: '按钮文字', type: 'text', required: true, placeholder: '例如：纯文字样式' },
            { name: 'event', label: '点击事件', type: 'select', options: EVENT_OPTIONS, default: 'url {https://}' }
        ],
        template: (data) => {
            let ev = data.event || 'url {https://}';
            if (ev === 'url {https://}') ev = 'url {https://www.example.com}';
            if (ev === 'copy {}') ev = 'copy {要复制的文字}';
            return `...button-text text="${data.text}" event="${ev}"`;
        }
    },

    // ==================== 布局组件（严格按照教程） ====================
    row: {
        name: '横向布局 (Row)',
        icon: '↔️',
        category: '布局',
        note: '⚠️ Row 内部可以放置按钮、图片、或嵌套的 Row/Column，但不能放 Card',
        fields: [
            { name: 'horizontal', label: '水平排列', type: 'select', options: [...HORIZONTAL_ARRANGEMENT, ...SPACED_BY_OPTIONS], default: 'Start', hint: '可使用 spacedBy(间距) 或 spacedBy(间距, 对齐方式)' },
            { name: 'vertical', label: '垂直对齐', type: 'select', options: VERTICAL_ALIGN, default: 'Top', hint: 'Top, Center, Bottom' }
        ],
        template: (data) => {
            let attrs = '';
            if (data.horizontal && data.horizontal !== 'Start') {
                attrs += ` horizontal=${data.horizontal}`;
            }
            if (data.vertical && data.vertical !== 'Top') {
                attrs += ` vertical=${data.vertical}`;
            }
            return `...row-start${attrs}\n    ...button text="按钮1" weight=(1)\n    ...button text="按钮2" weight=(1)\n...row-end`;
        }
    },
    
    column: {
        name: '纵向布局 (Column)',
        icon: '↕️',
        category: '布局',
        note: '⚠️ Column 内部可以放置按钮、图片、或嵌套的 Row/Column，但不能放 Card',
        fields: [
            { name: 'vertical', label: '垂直排列', type: 'select', options: [...HORIZONTAL_ARRANGEMENT, 'spacedBy(8)', 'spacedBy(12)'], default: 'Top', hint: '可使用 spacedBy(间距) 控制子项距离' },
            { name: 'horizontal', label: '水平对齐', type: 'select', options: ['Start', 'Center', 'End'], default: 'Start' }
        ],
        template: (data) => {
            let attrs = '';
            if (data.vertical && data.vertical !== 'Top') {
                attrs += ` vertical=${data.vertical}`;
            }
            if (data.horizontal && data.horizontal !== 'Start') {
                attrs += ` horizontal=${data.horizontal}`;
            }
            return `...column-start${attrs}\n    ...button text="按钮1"\n    ...button text="按钮2"\n...column-end`;
        }
    },

    // ==================== 带权重的按钮（用于 Row 内部） ====================
    button_weighted: {
        name: '权重按钮 (weight)',
        icon: '⚖️',
        category: '高级',
        note: '⚠️ 仅在 Row 组件内部可用，用于分配子组件的宽度',
        fields: [
            { name: 'text', label: '按钮文字', type: 'text', required: true, placeholder: '例如：按钮' },
            { name: 'weight', label: '权重值', type: 'text', required: true, placeholder: '1', hint: '格式：weight=(数值)，例如 weight=(1) 或 weight=(2, noFill)' },
            { name: 'event', label: '点击事件', type: 'select', options: EVENT_OPTIONS, default: 'url {https://}' }
        ],
        template: (data) => {
            let ev = data.event || 'url {https://}';
            if (ev === 'url {https://}') ev = 'url {https://www.example.com}';
            if (ev === 'copy {}') ev = 'copy {要复制的文字}';
            // 权重格式：weight=(1) 严格按照教程
            let weightStr = data.weight || '1';
            if (!weightStr.startsWith('(')) weightStr = `(${weightStr})`;
            return `...button text="${data.text}" event="${ev}" weight=${weightStr}`;
        }
    },

    // ==================== 媒体组件 ====================
    image: {
        name: '图片组件 (...image)',
        icon: '🖼️',
        category: '媒体',
        note: 'width 支持百分比或 dp 单位，shape 支持圆角',
        fields: [
            { name: 'url', label: '图片链接', type: 'text', required: true, placeholder: 'https://picsum.photos/400', hint: '必填，支持网络图片' },
            { name: 'width', label: '宽度', type: 'text', placeholder: '40%', hint: '例如：50% 或 200dp' },
            { name: 'shape', label: '圆角', type: 'select', options: SHAPE_OPTIONS, placeholder: '留空为默认', hint: '例如：12dp 或 20%' }
        ],
        template: (data) => {
            let attrs = `url="${data.url}"`;
            if (data.width && data.width.trim()) attrs += ` width=${data.width}`;
            if (data.shape && data.shape.trim()) attrs += ` shape=${data.shape}`;
            return `...image ${attrs}`;
        }
    },

    // ==================== 排版组件 ====================
    divider: {
        name: '分割线',
        icon: '➖',
        category: '排版',
        note: 'Markdown 语法：---',
        fields: [],
        template: () => '\n---\n'
    },
    
    heading: {
        name: '标题',
        icon: '📌',
        category: '排版',
        fields: [
            { name: 'level', label: '标题级别', type: 'select', options: ['# H1', '## H2', '### H3', '#### H4', '##### H5', '###### H6'], default: '## H2' },
            { name: 'text', label: '标题文字', type: 'text', required: true, placeholder: '例如：章节标题' }
        ],
        template: (data) => {
            const level = data.level.split(' ')[0];
            return `${level} ${data.text}`;
        }
    },
    
    quote: {
        name: '引用块',
        icon: '💬',
        category: '排版',
        fields: [
            { name: 'text', label: '引用内容', type: 'textarea', required: true, placeholder: '这是引用内容...' }
        ],
        template: (data) => {
            return `> ${data.text}`;
        }
    },
    
    list: {
        name: '列表',
        icon: '📋',
        category: '排版',
        fields: [
            { name: 'type', label: '列表类型', type: 'select', options: ['无序列表 (-)', '有序列表 (1.)'], default: '无序列表 (-)' },
            { name: 'items', label: '列表项', type: 'textarea', required: true, placeholder: '项目1\n项目2\n项目3', hint: '每行一个项目' }
        ],
        template: (data) => {
            const items = data.items.split('\n').filter(item => item.trim());
            const marker = data.type === '有序列表 (1.)' ? '1. ' : '- ';
            return items.map(item => `${marker}${item.trim()}`).join('\n');
        }
    }
};

// 帮助内容（严格按照教程）
const HelpContent = `
<h3>📦 卡片组件</h3>
<p>用于将内容包裹在一个有背景和圆角的容器中。⚠️ 卡片不能放在 Row/Column 内部！</p>
<pre><code>...card-start title="我的卡片" shape=large contentPadding=(16, 12)
这里是卡片内部的内容，支持标准 **Markdown**
...card-end</code></pre>

<h3>🔘 按钮组件（4种样式）</h3>
<pre><code>...button text="填充样式" event="url {https://www.bilibili.com/}"
...button-outlined text="外框样式" event="check_update"
...button-filled-tonal text="色调填充样式"
...button-text text="纯文字样式"</code></pre>

<h3>↔️ 横向布局 (Row)</h3>
<pre><code>...row-start horizontal=spacedBy(8) vertical=Center
    ...button text="按钮1" weight=(1)
    ...button text="按钮2" weight=(1)
...row-end</code></pre>

<h3>↕️ 纵向布局 (Column)</h3>
<pre><code>...column-start vertical=spacedBy(8) horizontal=Center
    ...button text="按钮1"
    ...button text="按钮2"
...column-end</code></pre>

<h3>🖼️ 图片组件</h3>
<pre><code>...image url="https://picsum.photos/400" width=40% shape=12dp</code></pre>

<h3>⚖️ 权重属性（仅在 Row 内部可用）</h3>
<pre><code>...row-start
    ...button text="按钮1" weight=(1)
    ...button text="按钮2" weight=(1)
...row-end
...row-start
    ...button text="按钮1" weight=(1)
    ...button text="按钮2" weight=(1, noFill)
...row-end</code></pre>

<h3>📋 支持的事件类型</h3>
<ul>
<li><code>event="url {https://...}"</code> - 在浏览器中打开链接</li>
<li><code>event="copy{...}"</code> - 复制指定内容</li>
<li><code>event="launch_game"</code> - 启动当前选中的版本</li>
<li><code>event="check_update"</code> - 触发启动器检查更新</li>
</ul>

<h3>🎨 圆角大小选项</h3>
<ul>
<li>预设：<code>extraSmall</code>, <code>small</code>, <code>medium</code>, <code>large</code>, <code>extraLarge</code></li>
<li>自定义数值：<code>12dp</code>（支持整数小数）</li>
<li>百分比圆角：<code>20%</code>（仅支持整数百分比）</li>
</ul>

<h3>⚠️ 注意事项</h3>
<ul>
<li>卡片组件 <strong>不能</strong> 被放进 Row/Column 中</li>
<li>标签必须成对出现，如 <code>...card-start</code> 与 <code>...card-end</code> 必须配对</li>
<li>扩展组件不能嵌入标准 Markdown 容器（如代码块、表格内部）</li>
<li><code>Row</code>/<code>Column</code> 内部放置普通文本时<strong>不能缩进</strong>，否则会出现渲染异常</li>
</ul>
`;

// 按分类组织的组件按钮
const COMPONENT_CATEGORIES = [
    { name: '📦 容器', items: ['card'] },
    { name: '🔘 按钮', items: ['button_filled', 'button_outlined', 'button_tonal', 'button_text'] },
    { name: '📐 布局', items: ['row', 'column'] },
    { name: '⚖️ 高级', items: ['button_weighted'] },
    { name: '🖼️ 媒体', items: ['image'] },
    { name: '📝 排版', items: ['divider', 'heading', 'quote', 'list'] }
];

// 获取组件显示名称
function getComponentDisplayName(type) {
    const names = {
        card: '📦 卡片',
        button_filled: '🔵 填充按钮',
        button_outlined: '🔲 边框按钮',
        button_tonal: '🎨 色调按钮',
        button_text: '📝 文字按钮',
        button_weighted: '⚖️ 权重按钮',
        row: '↔️ 横向布局',
        column: '↕️ 纵向布局',
        image: '🖼️ 图片',
        divider: '➖ 分割线',
        heading: '📌 标题',
        quote: '💬 引用块',
        list: '📋 列表'
    };
    return names[type] || type;
}

// 导出到全局
window.ComponentTemplates = ComponentTemplates;
window.HelpContent = HelpContent;
window.COMPONENT_CATEGORIES = COMPONENT_CATEGORIES;
window.getComponentDisplayName = getComponentDisplayName;