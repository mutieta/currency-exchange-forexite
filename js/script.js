dropList = document.querySelectorAll(".drop-list select");
fromCurrency = document.querySelector(".from select");
toCurrency = document.querySelector(".to select");
getButton = document.querySelector("form button");

for (let i = 0; i < dropList.length; i++) {
    for (currency_code in country_code) {
        // Selecting KHR by default as FROM currency and USD as TO currency
        let selected;
        if (i === 0) {
            selected = currency_code === "KHR" ? "selected" : "";
        } else if (i === 1) {
            selected = currency_code === "USD" ? "selected" : "";
        }
        // Create option tag with currency code as text and value
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        // Insert option tag inside select tag
        dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }
    dropList[i].addEventListener("change", e => {
        loadFlag(e.target);
    });
}

// Load country flag based on selected currency
function loadFlag(element) {
    for (code in country_code) {
        if (code == element.value) {
            let imgTag = element.parentElement.querySelector("img");
            imgTag.src = `https://flagsapi.com/${country_code[code]}/flat/64.png`;
        }
    }
}

window.addEventListener("load", () => {
    getExchangeRate();
});

getButton.addEventListener("click", e => {
    e.preventDefault(); // Prevent form from submitting
    getExchangeRate();
});

// Switch currency and flag
const exchangeIcon = document.querySelector(".drop-list .icon");
exchangeIcon.addEventListener("click", () => {
    let tempCode = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCode;
    loadFlag(fromCurrency);
    loadFlag(toCurrency);
    getExchangeRate();
});

function getExchangeRate() {
    const amount = document.querySelector(".amount input"),
        exchangeRateTxt = document.querySelector(".exchange-rate");
    const warningTxt = document.querySelector(".warning-text"); // Element for displaying warnings
    let amountVal = amount.value;

    // Clear any previous warning
    warningTxt.innerText = "";

    // Check if the input is a valid number
    if (isNaN(amountVal) || amountVal.trim() === "" || amountVal <= 0) {
        warningTxt.innerText = "Please enter a valid number greater than 0."; // Display warning text
        amount.value = "1"; // Set default value as 1
        amountVal = 1;
        return; // Exit the function early
    } else {
        amountVal = parseFloat(amountVal); // Convert to number if valid
    }

    exchangeRateTxt.innerText = "Getting exchange rate...";
    let url = `https://v6.exchangerate-api.com/v6/429ebd760eb0d10ab0677865/latest/${fromCurrency.value}`;
    fetch(url)
        .then((response) => response.json())
        .then((result) => {
            let exchangeRate = result.conversion_rates[toCurrency.value];
            let totalExchangeRate = (amountVal * exchangeRate).toFixed(4);
            exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
        }).catch(() => {
            exchangeRateTxt.innerText = "Something went wrong";
        });
    
   // Fetch exchange rate data from API for KHR to USD and USD to KHR
Promise.all([
    fetch('https://v6.exchangerate-api.com/v6/429ebd760eb0d10ab0677865/latest/KHR'),
    fetch('https://v6.exchangerate-api.com/v6/429ebd760eb0d10ab0677865/latest/USD')
  ])
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(data => {
      const khrToUsdRate = data[0].conversion_rates.USD; // Get KHR to USD rate
      const usdToKhrRate = data[1].conversion_rates.KHR; // Get USD to KHR rate
  
      const khrToUsdTable = document.getElementById("exchange-rates-khr-to-usd");
      const usdToKhrTable = document.getElementById("exchange-rates-usd-to-khr");
  
      // Example arrays for KHR and USD values
      const khrValues = [1000, 5000, 10000, 40000, 100000, 400000, 1000000]; // Replace with your values
      const usdValues = [1, 5, 10, 100, 500, 1000, 1000] ; // Replace with your values
  
      // Populate KHR to USD exchange rates
      khrValues.forEach(value => {
        const usdValue = (value * khrToUsdRate).toFixed(4);
        const row = `<tr><td>${value.toLocaleString()} KHR</td><td>${usdValue} USD</td></tr>`;
        khrToUsdTable.insertAdjacentHTML('beforeend', row);
      });
  
      // Populate USD to KHR exchange rates
      usdValues.forEach(value => {
        const khrValue = (value * usdToKhrRate).toFixed(4);
        const row = `<tr><td>${value.toLocaleString()} USD</td><td>${khrValue} KHR</td></tr>`;
        usdToKhrTable.insertAdjacentHTML('beforeend', row);
      });
    })
    .catch(error => console.error('Error fetching exchange rates:', error));
}

