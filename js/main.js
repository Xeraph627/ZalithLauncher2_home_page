document.addEventListener('DOMContentLoaded', async () => {
    initDragAndDrop();
    bindMenuButtons();
    bindModalEvents();
    
    const time = await fetchBeijingTime();
    console.log('时间:', time.full);
    
    loadFromUrl('home_page.md').catch(() => {
        loadFromUrl('sample.md').catch(() => newFile());
    });
});

window.currentMarkdown = '';
window.currentFileName = 'home_page.md';
window.isEditMode = false;