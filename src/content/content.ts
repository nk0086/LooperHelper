console.log("Content script is loaded and running!");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Retrieved message:", message);
  // setLoopInfo アクションの処理
  if (message.action === 'setLoopInfo') {
    // 入力フィールドに情報をセット
    const urlField = document.querySelector('#youtube-video-url') as HTMLInputElement;
    const startField = document.querySelector('#youtube-video-start') as HTMLInputElement;
    const endField = document.querySelector('#youtube-video-end') as HTMLInputElement;
    
    if (urlField && startField && endField) {
      urlField.value = message.data.url;
      startField.value = message.data.start;
      endField.value = message.data.end;

      sendResponse({ success: true });
    } else {
      sendResponse({ success: false });
    }

    return;
  }
  // getLoopInfo アクションの処理
  if (message.action === 'getLoopInfo') {
    // 指定のIDからデータを取得
    const urlField = document.querySelector('#youtube-video-url') as HTMLInputElement;
    const startField = document.querySelector('#youtube-video-start') as HTMLInputElement;
    const endField = document.querySelector('#youtube-video-end') as HTMLInputElement;

    const data = {
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

