// src/panel.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateQuery') {
        document.getElementById('query').innerText = `You searched for: ${message.query}`;
    }
});