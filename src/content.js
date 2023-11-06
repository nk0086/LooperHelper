console.log("Content script is loaded and running!");
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log("Retrieved message:", message);
    // setLoopInfo アクションの処理
    if (message.action === 'setLoopInfo') {
        // 入力フィールドに情報をセット
        var urlField = document.querySelector('#youtube-video-url');
        var startField = document.querySelector('#youtube-video-start');
        var endField = document.querySelector('#youtube-video-end');
        if (urlField && startField && endField) {
            urlField.value = message.data.url;
            startField.value = message.data.start;
            endField.value = message.data.end;
            sendResponse({ success: true });
        }
        else {
            sendResponse({ success: false });
        }
        return;
    }
    // getLoopInfo アクションの処理
    if (message.action === 'getLoopInfo') {
        // 指定のIDからデータを取得
        var urlField = document.querySelector('#youtube-video-url');
        var startField = document.querySelector('#youtube-video-start');
        var endField = document.querySelector('#youtube-video-end');
        var data = {
            url: urlField ? urlField.value : null,
            start: startField ? startField.value : null,
            end: endField ? endField.value : null
        };
        // console.log("Data to send from content script:", data);
        sendResponse(data);
        return;
    }
    return true;
});
