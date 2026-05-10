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

// 编辑模式切换
let isEditMode = false;

function toggleEditMode() {
    const editPanel = document.getElementById('editPanel');
    const editBtn = document.getElementById('editBtn');
    
    if (isEditMode) {
        editPanel.style.display = 'none';
        editBtn.textContent = '✏️ 编辑';
        isEditMode = false;
        showToast('已退出编辑模式');
    } else {
        editPanel.style.display = 'flex';
        document.getElementById('editor').value = currentMarkdown;
        editBtn.textContent = '👁️ 预览';
        isEditMode = true;
        showToast('进入编辑模式，点击组件按钮快速插入');
    }
}

// 绑定组件按钮事件
function bindComponentButtons() {
    const btns = document.querySelectorAll('.comp-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.type;
            if (!isEditMode) {
                showToast('请先点击"编辑"按钮进入编辑模式');
                return;
            }
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

// 绑定工具栏按钮
function bindToolbarButtons() {
    document.getElementById('editBtn').onclick = toggleEditMode;
    document.getElementById('downloadBtn').onclick = downloadFile;
    document.getElementById('uploadBtn').onclick = uploadFile;
    document.getElementById('newBtn').onclick = newFile;
    document.getElementById('refreshBtn').onclick = () => renderPreview(currentMarkdown);
    document.getElementById('saveBtn').onclick = saveFromEditor;
    document.getElementById('cancelBtn').onclick = () => {
        document.getElementById('editor').value = currentMarkdown;
        showToast('已取消修改');
    };
}