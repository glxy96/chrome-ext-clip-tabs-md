// content.js (新規作成が必要)
chrome.runtime.onMessage.addListener((message) => {
if (message.type === "COPY_SUCCESS") {
    // 成功メッセージを表示
    const msg = document.createElement('div');
    msg.textContent = 'URLsをコピーしました！';
    msg.style.position = 'fixed';
    msg.style.top = '10px';
    msg.style.left = '50%';
    msg.style.transform = 'translateX(-50%)';
    msg.style.padding = '10px 20px';
    msg.style.backgroundColor = '#4CAF50';
    msg.style.color = 'white';
    msg.style.borderRadius = '5px';
    msg.style.zIndex = '9999';
    document.body.appendChild(msg);
    
    // 0.5秒後にメッセージを消す
    setTimeout(function() {
    document.body.removeChild(msg);
    }, 500);
}
});