const quoteContainer = document.getElementById("quote-container");
const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");
const twitterBtn = document.getElementById("twitter");
const newQuoteBtn = document.getElementById("new-quote");
const loader = document.getElementById("loader");

//loading spinner shown
function showLoadingSpinner() {
  loader.hidden = false;
  quoteContainer.hidden = true;
}

//loading spinner hidden
function removeLoadingSpinner() {
  loader.hidden = true;
  quoteContainer.hidden = false;
}

// Retry Attempts
let retry = 0;

// Get quote from api

async function getQuote() {
  showLoadingSpinner();

  //*
  // const proxyUrl = "https://corsproxy.io/?";
  const proxyUrl = `https://api.allorigins.win/get?url=`;
  const apiUrl =
    "https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json";
  const finalUrl = `${proxyUrl}${encodeURIComponent(apiUrl)}`;

  try {
    //* We need to use proxy URL to make our API call in order to avoid CORS
    const response = await fetch(finalUrl);
    const proxyData = await response.json();
    const data = JSON.parse(data.contents);

    //* Check if author field is blank and replace it with 'Unknown'
    if (data.quoteAuthor === "") {
      authorText.innerText = "Unknown";
    } else {
      authorText.innerText = data.quoteAuthor;
    }

    //*Dynamically reduce font size for long quotes
    if (data.quoteText.length > 120) {
      quoteText.classList.add("long-quote");
    } else {
      quoteText.classList.remove("long-quote");
    }

    quoteText.innerText = data.quoteText;

    removeLoadingSpinner();
  } catch (error) {
    console.log(error);
    if (retry < 4) getQuote();
    else {
      removeLoadingSpinner();
      quoteText.innerText = error?.message
        ? error.message
        : `Coundn't Load the Quote`;
    }
    ++retry;
  }
}

//Twitter configuration

function tweetQuote() {
  const quote = quoteText.innerText;
  const author = authorText.innerText;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
  window.open(twitterUrl, "_blank");
}

//Event Listeners

newQuoteBtn.addEventListener("click", getQuote);
twitterBtn.addEventListener("click", tweetQuote);

//On page load
getQuote();
