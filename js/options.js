import { searchRepository } from './service/github.js';

searchRepository('facebook/react');

const checkbox = qs('.toggle-default-tab');

checkbox.addEventListener('click', function() {
    chrome.storage.sync.set({ defaultnewtab: checkbox.checked });
});

console.log(chrome.storage);
chrome.storage.sync.get('defaultnewtab', function(storage) {
    if (storage.defaultnewtab) {
        chrome.tabs.update({ url: 'chrome-search://local-ntp/local-ntp.html' });
    }
});
