const countries = document.querySelectorAll("path"); // Select all SVG countries
const sidePanel = document.querySelector(".sidePanel");
const container = document.querySelector(".container");
const closeButton = document.querySelector(".closeButton");
const loading = document.querySelector(".loading");
const zoomInButton = document.querySelector(".zoomIn");
const zoomOutButton = document.querySelector(".zoomOut");
const zoomValuesOutput = document.querySelector(".zoomValues");

const countryNameOutput = document.querySelector(".countryName");
const countryFlagOutput = document.querySelector(".countryFlag");
const cityOutput = document.querySelector(".city");
const areaOutput = document.querySelector(".area");
const currencyOutput = document.querySelector(".currency");
const languageOutput = document.querySelector(".language");

// Debug: confirm how many paths (countries) are selected
console.log("Total countries found:", countries.length);

countries.forEach(country => {
country.addEventListener("mouseenter", function () {
    const classList = [...this.classList];
    if (classList.length === 0) return; // skip if no class

    const selector = '.' + classList.join('.');
    const matchingElements = document.querySelectorAll(selector);
    matchingElements.forEach(el => el.style.fill = "#c99aff");
});

country.addEventListener("mouseout", function () {
    const classList = [...this.classList];
    if (classList.length === 0) return; // skip if no class

    const selector = '.' + classList.join('.');
    const matchingElements = document.querySelectorAll(selector);
    matchingElements.forEach(el => el.style.fill = "#443d4b");
});


  country.addEventListener("click", function (e) {
    console.log("Country clicked:", e.target);

    loading.innerText = "Loading...";
    container.classList.add("hide");
    loading.classList.remove("hide");

    let clickedCountryName;

    if (e.target.hasAttribute("name")) {
      clickedCountryName = e.target.getAttribute("name");
    } else {
      clickedCountryName = e.target.classList.value;
    }

    console.log("Clicked country name:", clickedCountryName);

    // Show the side panel
    sidePanel.classList.add("sidePanelOpen"); // Ensure this matches the CSS class exactly
    console.log("Side panel opened:", sidePanel.classList.contains("sidePanelOpen"));

    fetch(`https://restcountries.com/v3.1/name/${clickedCountryName}?fullText=true`)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        console.log("API data received:", data);

        setTimeout(() => {
          const country = data[0];
          countryNameOutput.innerText = country.name?.common || "Unknown";
          countryFlagOutput.src = country.flags?.png || "";
          cityOutput.innerText = country.capital?.[0] || "N/A";

          const formattedNumber = (country.area || 0).toLocaleString('de-DE');
          areaOutput.innerHTML = `${formattedNumber} km<sup>2</sup>`;

          const currencies = country.currencies || {};
          currencyOutput.innerHTML = "";
          Object.keys(currencies).forEach(key => {
            currencyOutput.innerHTML += `<li>${currencies[key].name}</li>`;
          });

          const languages = country.languages || {};
          languageOutput.innerHTML = "";
          Object.keys(languages).forEach(key => {
            languageOutput.innerHTML += `<li>${languages[key]}</li>`;
          });

          countryFlagOutput.onload = () => {
            container.classList.remove("hide");
            loading.classList.add("hide");
            console.log("Country info loaded and panel updated");
          };
        }, 500);
      })
      .catch(error => {
        loading.innerText = "No data for selected country";
        console.error("Error fetching country data:", error);
      });
  });
});

const map = document.querySelector("svg");

// Optional: Close button handler
closeButton.addEventListener("click", () => {
  sidePanel.classList.remove("sidePanelOpen");
  console.log("Side panel closed");
});

let zoomValue = 100;
zoomOutButton.disabled = true;

zoomInButton.addEventListener("click", () => {
    zoomValue += 100;

    if (zoomValue >= 500) {
        zoomInButton.disabled = true;
    }
    zoomOutButton.disabled = false;

    map.style.width = zoomValue + "vw";
    map.style.height = zoomValue + "vh";
    zoomValuesOutput.innerText = zoomValue + "%";
});

zoomOutButton.addEventListener("click", () => {
    zoomValue -= 100;

    if (zoomValue <= 100) {
        zoomOutButton.disabled = true;
    }
    zoomInButton.disabled = false;

    map.style.width = zoomValue + "vw";
    map.style.height = zoomValue + "vh";
    zoomValuesOutput.innerText = zoomValue + "%";
});
