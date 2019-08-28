chrome.browserAction.onClicked.addListener(function() {
    chrome.storage.sync.remove('defaultnewtab');
    chrome.tabs.update({ url: chrome.runtime.getURL('index.html') });
});
