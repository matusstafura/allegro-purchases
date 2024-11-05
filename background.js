chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'STORE_ORDERS') {
        chrome.storage.local.set({ ordersArray: message.ordersArray }, () => {
            console.log("Orders array saved in background.");
            sendResponse({ status: "success" });
        });
        return true;
    }
});

