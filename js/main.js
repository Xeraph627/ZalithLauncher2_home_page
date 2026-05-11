/**
 * 主入口 - 初始化应用
 */

document.addEventListener('DOMContentLoaded', async () => {
    // 初始化拖拽和UI
    initDragAndDrop();
    bindMenuButtons();
    bindModalEvents();
    
    // 获取网络时间（用于显示）
    const time = await fetchBeijingTime();
    console.log('当前时间:', time.full);
    
    // 尝试加载默认文件
    loadFromUrl('home_page.md').catch(() => {
        loadFromUrl('sample.md').catch(() => {
            newFile();
        });
    });
});

window.currentMarkdown = '';
window.currentFileName = 'home_page.md';
window.isEditMode = false;