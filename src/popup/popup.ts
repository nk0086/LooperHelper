document.getElementById('saveCurrentLoop').addEventListener('click', () => {
  // 現在のタブの情報を取得
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const currentTab = tabs[0];
    if (currentTab && currentTab.id) {
      // content scriptにメッセージを送信して、リンクと時間の情報を取得
      chrome.tabs.sendMessage(currentTab.id, { action: 'getLoopInfo' }, (response) => {
        if (chrome.runtime.lastError) {
          console.log("Error sending message:", chrome.runtime.lastError);
        }

        console.log("Response from content script:", response);

        if (response) {
          const newLoop = {
            id: Date.now(),
            url: response.url,
            start: response.start,
            end: response.end
          }

          chrome.storage.local.get('loops', data => {
            const loops = data.loops || [];
            loops.push(newLoop);
            chrome.storage.local.set({ loops });
            renderSavedLoops(loops);
          });
        }
      });
    }
  });
});

function renderSavedLoops(loops: any[]) {
  const ul = document.getElementById('savedLoops') as HTMLUListElement;
  ul.innerHTML = '';  // 既存のリストをクリア

  loops.forEach(loop => {
    const li = document.createElement('li');
    li.textContent = `ID: ${loop.id}`;
    li.addEventListener('click', () => {
      // 現在のタブの情報を取得
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const currentTab = tabs[0];
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
chrome.storage.local.get('loops', data => {
  const loops = data.loops || [];
  renderSavedLoops(loops);
});

