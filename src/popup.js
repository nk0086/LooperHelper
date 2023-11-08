// Saveボタンのイベントリスナー
document.getElementById('saveCurrentLoop').addEventListener('click', function () {
    var loopNameValue = document.getElementById('loopName').value; // ループ名の入力値を取得
    // 現在のタブの情報を取得
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var currentTab = tabs[0];
        if (currentTab && currentTab.id) {
            // content scriptにメッセージを送信して、時間の情報を取得
            chrome.tabs.sendMessage(currentTab.id, { action: 'getLoopInfo' }, function (response) {
                if (response) {
                    var newLoop = {
                        name: loopNameValue, // ユーザーが入力したループ名
                        title: response.title, // タイトル
                        start: response.start, // 開始時間
                        end: response.end // 終了時間
                    };
                    // ローカルストレージに保存
                    chrome.storage.local.get('loops', function (data) {
                        var loops = data.loops || [];
                        loops.push(newLoop);
                        chrome.storage.local.set({ loops: loops }, function() {
                            if (chrome.runtime.lastError) {
                                console.log("Error setting loops:", chrome.runtime.lastError);
                            } else {
                                renderSavedLoops(loops); // 一覧を更新
                            }
                        });
                    });
                } else if (chrome.runtime.lastError) {
                    // エラーハンドリング
                    console.log("Error sending message:", chrome.runtime.lastError);
                }
            });
        }
    });
});

// Clearボタンのイベントリスナー
document.getElementById('clearSavedLoops').addEventListener('click', function () {
    chrome.storage.local.set({ loops: [] }, function() {
        renderSavedLoops([]); // 一覧をクリア
    });
});

// 保存されたループ情報を表示する関数
function renderSavedLoops(loops) {
    var ul = document.getElementById('savedLoops');
    ul.innerHTML = ''; // 既存のリストをクリア
    loops.forEach(function (loop, index) {
        var li = document.createElement('li');
        li.textContent = loop.name || loop.title; // ループ名がない場合はデフォルトの名前を使用
        ul.appendChild(li);
    });
}

// 初期ロード時に保存されたループ情報を表示
chrome.storage.local.get('loops', function (data) {
    renderSavedLoops(data.loops || []);
});


