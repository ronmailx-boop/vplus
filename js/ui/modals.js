export function openModal(id) {
  document.getElementById(id)?.classList.remove('hidden');
}

export function closeModal(id) {
  document.getElementById(id)?.classList.add('hidden');
}

let toastTimer = null;
let toastHasActiveUndo = false;

export function showToast(text, { undoLabel = null, onUndo = null, anchorRect = null, itemShaped = false, accentColor = null } = {}) {
  const bar = document.getElementById('toastBar');
  const content = document.getElementById('toastContent');
  const undoBtn = document.getElementById('toastUndoBtn');
  if (!bar || !content || !undoBtn) return;

  const isUndoToast = !!(undoLabel && onUndo);
  // A toast the user can still undo must not be silently clobbered by an unrelated
  // background notice (e.g. a transient live-share sync error) landing in the same window —
  // that notice will surface again on its own (next poll/push), the undo chance won't.
  if (toastHasActiveUndo && !isUndoToast) return;
  toastHasActiveUndo = isUndoToast;

  content.textContent = text;
  clearTimeout(toastTimer);

  if (anchorRect) {
    bar.style.top = `${anchorRect.top}px`;
    bar.style.left = `${anchorRect.left}px`;
    bar.style.width = `${anchorRect.width}px`;
    bar.style.right = 'auto';
    bar.style.bottom = 'auto';
    bar.style.maxWidth = 'none';
    bar.style.margin = '0';
  } else {
    bar.style.top = '';
    bar.style.left = '';
    bar.style.width = '';
    bar.style.right = '';
    bar.style.bottom = '';
    bar.style.maxWidth = '';
    bar.style.margin = '';
  }

  bar.classList.toggle('toast-item-shape', itemShaped);
  if (itemShaped && accentColor) bar.style.setProperty('--cat', accentColor);
  else bar.style.removeProperty('--cat');

  if (undoLabel && onUndo) {
    undoBtn.textContent = undoLabel;
    undoBtn.classList.remove('hidden');
    undoBtn.onclick = () => {
      onUndo();
      hideToast();
    };
  } else {
    undoBtn.classList.add('hidden');
    undoBtn.onclick = null;
  }

  bar.classList.remove('hidden');
  toastTimer = setTimeout(hideToast, 5000);
}

export function hideToast() {
  clearTimeout(toastTimer);
  toastHasActiveUndo = false;
  document.getElementById('toastBar')?.classList.add('hidden');
}

export function setupGenericModalDismiss() {
  document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) backdrop.classList.add('hidden');
    });
    backdrop.querySelectorAll('.modal-cancel').forEach((btn) => {
      btn.addEventListener('click', () => backdrop.classList.add('hidden'));
    });
  });
}

export function confirmDialog(text) {
  return new Promise((resolve) => {
    document.getElementById('confirmModalText').textContent = text;
    const okBtn = document.getElementById('confirmModalOkBtn');
    const cleanup = () => {
      okBtn.removeEventListener('click', onOk);
      closeModal('confirmModal');
    };
    const onOk = () => {
      cleanup();
      resolve(true);
    };
    okBtn.addEventListener('click', onOk);
    const backdrop = document.getElementById('confirmModal');
    backdrop.querySelectorAll('.modal-cancel').forEach((btn) => {
      btn.addEventListener(
        'click',
        () => {
          cleanup();
          resolve(false);
        },
        { once: true }
      );
    });
    openModal('confirmModal');
  });
}
