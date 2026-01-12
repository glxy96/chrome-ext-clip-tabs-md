// Offscreen document - クリップボードアクセス専用

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'COPY_TO_CLIPBOARD') {
    copyToClipboard(message.text)
      .then(() => {
        sendResponse({ success: true });
      })
      .catch((error) => {
        console.error('クリップボードへのコピーに失敗しました:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // 非同期レスポンスを送信することを示す
  }
});

async function copyToClipboard(text) {
  try {
    // textarea要素を作成してクリップボードにコピー
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);

    if (!successful) {
      throw new Error('execCommand("copy") failed');
    }
  } catch (err) {
    throw new Error('Clipboard write failed: ' + err.message);
  }
}
