let costsUsd = document.getElementById("costs-usd");
let walletEth = document.getElementById("wallet-eth");
let currentEth = document.getElementById("current-eth");
let currentLow = document.getElementById("current-low");
let currentHigh = document.getElementById("current-high");
let incomeUsd = document.getElementById("income-usd");
let incomeP = document.getElementById("income-p");

const port = chrome.runtime.connect();

function updateFields() {
  fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum"
  )
    .then((res) => res.json())
    .then((res) => res[0])
    .then((res) => {
      chrome.storage.sync.get(
        ["costsUsd", "walletEth"],
        function ({ costsUsd: costsUsdValue, walletEth: walletEthValue }) {
          const incomeValue =
            res.current_price * walletEthValue - costsUsdValue;
          currentEth.value = res.current_price;
          currentHigh.value = res.high_24h;
          currentLow.value = res.low_24h;
          incomeUsd.value = incomeValue;
          incomeP.value = (incomeValue / costsUsdValue) * 100;
        }
      );
    });
}

chrome.storage.sync.get(
  ["costsUsd", "walletEth"],
  function ({ costsUsd: costsUsdValue, walletEth: walletEthValue }) {
    costsUsd.value = costsUsdValue;
    walletEth.value = walletEthValue;
  }
);

chrome.alarms.onAlarm.addListener(updateFields);
updateFields();

costsUsd.addEventListener("change", (event) => {
  const num = Number.parseFloat(event.target.value);
  if (num) {
    chrome.storage.sync.set({ costsUsd: num });
  }
});
walletEth.addEventListener("change", (event) => {
  const num = Number.parseFloat(event.target.value);
  if (num) {
    chrome.storage.sync.set({ walletEth: num });
  }
});
