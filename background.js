// Offscreen documentの管理
let offscreenDocumentCreated = false;

async function setupOffscreenDocument() {
  if (offscreenDocumentCreated) return;

  try {
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['CLIPBOARD'],
      justification: 'クリップボードへのテキスト書き込み'
    });
    offscreenDocumentCreated = true;
  } catch (error) {
    // すでに作成済みの場合はエラーになるが問題ない
    if (!error.message.includes('Only a single offscreen document')) {
      console.error('Offscreen document作成エラー:', error);
    }
  }
}

// 拡張機能アイコンをクリックしたときの処理
chrome.action.onClicked.addListener(async (tab) => {
  // 現在のウィンドウで選択されているタブを取得
  chrome.tabs.query({ highlighted: true, currentWindow: true }, async (tabs) => {
    if (tabs.length === 0) return;

    // Markdown形式のリストを生成
    let markdownText = '';
    tabs.forEach(tab => {
      markdownText += `- [${escapeMarkdown(tab.title)}](${tab.url})\n`;
    });

    // クリップボードにコピー
    await copyToClipboard(markdownText);
  });
});

// Markdown向けに特殊文字をエスケープする関数
function escapeMarkdown(text) {
  if (!text) return '';
  // タイトル内で問題となる [ と ] のみエスケープ
  return text.replace(/([[\]])/g, '\\$1');
}

// クリップボードにコピーする関数
async function copyToClipboard(text) {
  try {
    // Offscreen documentを準備
    await setupOffscreenDocument();

    // Offscreen documentにメッセージを送信してクリップボードにコピー
    const response = await chrome.runtime.sendMessage({
      type: 'COPY_TO_CLIPBOARD',
      text: text
    });

    if (response && response.success) {
      // コピー完了を通知
      chrome.action.setBadgeText({ text: "✓" });
      setTimeout(() => {
        chrome.action.setBadgeText({ text: "" });
      }, 1500);

      // アクティブなタブに成功メッセージを送信
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, { type: "COPY_SUCCESS" })
            .catch(() => {
              // content scriptが読み込まれていない場合は無視
            });
        }
      });
    } else {
      console.error('クリップボードへのコピーに失敗しました');
    }
  } catch (error) {
    console.error('クリップボード操作エラー:', error);
  }
}
