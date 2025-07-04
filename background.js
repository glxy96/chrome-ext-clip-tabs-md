// 拡張機能アイコンをクリックしたときの処理
chrome.action.onClicked.addListener((tab) => {
  // 現在のウィンドウで選択されているタブを取得
  chrome.tabs.query({ highlighted: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) return;
    
    // Markdown形式のリストを生成
    let markdownText = '';
    tabs.forEach(tab => {
      markdownText += `- [${escapeMarkdown(tab.title)}](${tab.url})\n`;
    });
    
    // クリップボードにコピー
    copyToClipboard(markdownText);
  });
});

// Markdown向けに特殊文字をエスケープする関数
function escapeMarkdown(text) {
  if (!text) return '';
  // []()などのMarkdown記法で特殊な意味を持つ文字をエスケープ
  return text.replace(/([[\]()>*#+\-_.!])/g, '\\$1');
}

// クリップボードにコピーする関数
function copyToClipboard(text) {
  // Service Workerでは直接クリップボードにアクセスできないため、
  // 一時的なコンテンツスクリプトを挿入して処理を行う
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (!tabs[0]) return;
    
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: copyTextToClipboard,
      args: [text]
    });
  });
  
  // コピー完了を通知
  chrome.action.setBadgeText({ text: "✓" });
  setTimeout(() => {
    chrome.action.setBadgeText({ text: "" });
  }, 1500);
}

// ページ内で実行される関数（クリップボードへのコピー実行）
function copyTextToClipboard(text) {
  try {
    navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('クリップボードへのコピーに失敗しました:', err);
  }
}
