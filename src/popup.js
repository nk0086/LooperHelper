document.getElementById('saveCurrentLoop').addEventListener('click', function () {
    // 現在のタブの情報を取得
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var currentTab = tabs[0];
        if (currentTab && currentTab.id) {
            // content scriptにメッセージを送信して、リンクと時間の情報を取得
            chrome.tabs.sendMessage(currentTab.id, { action: 'getLoopInfo' }, function (response) {
                if (chrome.runtime.lastError) {
                    console.log("Error sending message:", chrome.runtime.lastError);
                }
                console.log("Response from content script:", response);
                if (response) {
                    var newLoop_1 = {
                        id: Date.now(),
                        url: response.url,
                        start: response.start,
                        end: response.end
                    };
                    chrome.storage.local.get('loops', function (data) {
                        var loops = data.loops || [];
                        loops.push(newLoop_1);
                        chrome.storage.local.set({ loops: loops });
                        renderSavedLoops(loops);
                    });
                }
            });
        }
    });
});
function renderSavedLoops(loops) {
    var ul = document.getElementById('savedLoops');
    ul.innerHTML = ''; // 既存のリストをクリア
    loops.forEach(function (loop) {
        var li = document.createElement('li');
        li.textContent = "ID: ".concat(loop.id);
        li.addEventListener('click', function () {
            // 現在のタブの情報を取得
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                var currentTab = tabs[0];
                if (currentTab && currentTab.id) {
                    // 現在のタブのコンテンツスクリプトにメッセージを送信して情報を自動入力
                    chrome.tabs.sendMessage(currentTab.id, {
                        action: 'setLoopInfo',
                        data: loop
                    });
                }
            });
        });
        ul.appendChild(li);
    });
}
// 初期ロード時に保存されたループ情報を表示
chrome.storage.local.get('loops', function (data) {
    var loops = data.loops || [];
    renderSavedLoops(loops);
});
