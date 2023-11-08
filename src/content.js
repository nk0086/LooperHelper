// メッセージリスナーを設定
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    // getLoopInfo アクションの場合
    if (message.action === 'getLoopInfo') {
        // ページから情報を取得
        const startTimeInput = document.getElementById('loop-slider-start-time-0');
        const endTimeInput = document.getElementById('loop-slider-end-time-0');
        // const titleElement = document.querySelector('h1.title') || document.querySelector('title'); // 適切なセレクタに更新してください
        const titleElement = document.querySelector('.style-scope ytd-watch-metadata .title') || document.querySelector('title');
        // 取得した情報をレスポンスとして返す
        sendResponse({
            start: startTimeInput ? startTimeInput.value : '',
            end: endTimeInput ? endTimeInput.value : '',
            title: titleElement ? titleElement.textContent : ''
        });

        return true; // 非同期レスポンスのためにtrueを返す
    }

    // setLoopInfo アクションの場合
    if (message.action === 'setLoopInfo') {
        // ページの要素に情報を設定
        const startTimeInput = document.getElementById('loop-slider-start-time-0');
        const endTimeInput = document.getElementById('loop-slider-end-time-0');
        const titleElement = document.querySelector('h1.title') || document.querySelector('title'); // 適切なセレクタに更新してください

        if (startTimeInput && endTimeInput && titleElement) {
            startTimeInput.value = message.data.start;
            endTimeInput.value = message.data.end;

            sendResponse({ success: true });
        } else {
            sendResponse({ success: false, message: 'Required elements not found on the page.' });
        }

        return true; // 非同期レスポンスのためにtrueを返す
    }
});

