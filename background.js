chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ costsUsd: 0.0, walletEth: 0.0 });
});

chrome.runtime.onConnect.addListener(function (externalPort) {
  chrome.alarms.create("fetch", { periodInMinutes: 0.1 });
  externalPort.onDisconnect.addListener(function () {
    chrome.alarms.clear("fetch");
  });
});
