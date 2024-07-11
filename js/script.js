dropList = document.querySelectorAll(".drop-list select");
fromCurrency = document.querySelector(".from select");
toCurrency = document.querySelector(".to select");
getButton = document.querySelector("form button");

for (let i = 0; i < dropList.length; i++) {
    for (currency_code in country_code) {
        // Selecting KHR by default as FROM currency and HKD as TO currency
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
    dropList[i].addEventListener("change", e =>{
        loadFlag(e.target);
    }) ;
}
 //country 
function loadFlag(element){
    for(code in country_code){
        if(code == element.value){
            let imgTag =  element.parentElement.querySelector("img");
            imgTag.src = `https://flagsapi.com/${country_code[code]}/flat/64.png`
        }
    }
}

window.addEventListener(" load", () => {
    getExchangeRate();
});


getButton.addEventListener("click", e => {
    e.preventDefault(); // Prevent form from submitting
    getExchangeRate();
});

//switch currency and flag
const exchangeIcon = document.querySelector(".drop-list .icon");
exchangeIcon.addEventListener("click", ()=>{
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
    let amountVal = amount.value;
    // If user didn't input anything or entered 0, set default value as 1
    if (amountVal === "" || amountVal === "0") {
        amount.value = "1";
        amountVal = 1;
    }
    exchangeRateTxt.innerText = "Getting exchange rate..."
    let url = `https://v6.exchangerate-api.com/v6/429ebd760eb0d10ab0677865/latest/${fromCurrency.value}`;
    fetch(url)
        .then((response) => response.json())
        .then((result) => {
            let exchangeRate = result.conversion_rates[toCurrency.value];
            let totalExchangeRate = (amountVal * exchangeRate).toFixed(2);
            exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
        }).catch(() =>{
            exchangeRateTxt.innerText = "Something went wrong";
        });
}