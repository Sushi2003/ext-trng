
// src/content.js
console.log("Google content script injected");

// Function to extract search query from Google search URL
function extractSearchQueryFromUrl(url) {
    const params = new URL(url).searchParams;
    return params.get('q') || '';
}

let lastQuery = '';

function checkQuery() {
    const query = extractSearchQueryFromUrl(window.location.href);
    if (query && query !== lastQuery) {
        lastQuery = query;
        chrome.runtime.sendMessage({ action: 'queryChanged', query });
    }
}

setInterval(checkQuery, 1000); // Check for query changes every second