console.log("Background script initialized");

const activeChatGPTTabs = new Set();
const pendingRequests = new Map();

function handleTabUpdate(tabId, changeInfo, tab) {
    if (changeInfo.status === "complete" && tab.url?.includes("https://chatgpt.com/")) {
        if (!activeChatGPTTabs.has(tabId)) {
            attachDebugger(tabId);
        }
    } else if (!tab.url?.includes("https://chatgpt.com/")) {
        detachDebugger(tabId);
    }
}

function handleTabActivated(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab.url?.includes("https://chatgpt.com/")) {
            attachDebugger(tab.id);
        } else {
            detachAllDebuggers();
        }
    });
}

function attachDebugger(tabId) {
    try {
        chrome.debugger.attach({ tabId }, "1.3", () => {
            console.log(`Debugger attached to tab: ${tabId}`);
            enableNetworkMonitoring(tabId);
            activeChatGPTTabs.add(tabId);
        });
    } catch (error) {
        console.error(`Failed to attach debugger to tab: ${tabId}`, error);
    }
}

function detachDebugger(tabId) {
    if (activeChatGPTTabs.has(tabId)) {
        try {
            chrome.debugger.detach({ tabId }, () => {
                console.log(`Debugger detached from tab: ${tabId}`);
                activeChatGPTTabs.delete(tabId);
            });
        } catch (error) {
            console.error(`Failed to detach debugger from tab: ${tabId}`, error);
        }
    }
}

function detachAllDebuggers() {
    activeChatGPTTabs.forEach((tabId) => {
        detachDebugger(tabId);
    });
}

function enableNetworkMonitoring(tabId) {
    try {
        chrome.debugger.sendCommand({ tabId }, "Network.enable", {}, () => {
            console.log("Network monitoring enabled");
            chrome.debugger.onEvent.addListener(handleDebuggerEvent);
        });
    } catch (error) {
        console.error(`Failed to enable network monitoring for tab: ${tabId}`, error);
        detachDebugger(tabId); // Clean up if network monitoring fails
    }
}

function handleDebuggerEvent(source, method, params) {
    if (activeChatGPTTabs.has(source.tabId)) {
        if (method === "Network.requestWillBeSent" && params.request.url === "https://chatgpt.com/backend-api/conversation") {
            console.log("Filtered Network request:", params.request);
            const postdata= params.request.postData;
            const rawMessage= JSON.parse(postdata);
            const userMessage= rawMessage.messages[0].content.parts;
            console.log("User Message:", userMessage);
        }

        if (method === "Network.responseReceived" && params.response.url === "https://chatgpt.com/backend-api/conversation") {
            console.log("Response received for filtered URL, waiting for 5 seconds before processing...", params.response);

            // Introduce a 5-second delay before processing the EventStream data
            setTimeout(() => {
                chrome.debugger.sendCommand({ tabId: source.tabId }, "Network.getResponseBody", { requestId: params.requestId }, (response) => {
                    if (response && response.body) {
                        // Log the raw response body as-is, including the "data:" prefix
                        console.log("Raw EventStream data:", response.body);
                    }
                });
            }, 7000); // 5000 milliseconds = 5 seconds
        }
    }
}
// Listener setup
chrome.tabs.onUpdated.addListener(handleTabUpdate);
chrome.tabs.onActivated.addListener(handleTabActivated);
chrome.tabs.onRemoved.addListener(detachDebugger);