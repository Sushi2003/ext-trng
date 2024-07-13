console.log("Background script initialized");

// src/background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'queryChanged') {
        chrome.runtime.sendMessage({ action: 'updateQuery', query: message.query });
    }
});