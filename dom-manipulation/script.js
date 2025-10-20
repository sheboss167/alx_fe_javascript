// ===== Dynamic Quote Generator with Server Sync =====

// Initialize quotes from localStorage or defaults
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don't let yesterday take up too much of today.", category: "Inspiration" },
  { text: "It's not whether you get knocked down, it's whether you get up.", category: "Perseverance" }
];

let lastFilter = localStorage.getItem("lastFilter") || "all";

document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  filterQuotes();
  document.getElementById("categoryFilter").value = lastFilter;
});

// === Event Listeners ===
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("exportQuotes").addEventListener("click", exportToJsonFile);

// === Display a random quote ===
function showRandomQuote() {
  const category = document.getElementById("categoryFilter").value;
  let filteredQuotes = category === "all" ? quotes : quotes.filter(q => q.category === category);

  if (filteredQuotes.length === 0) {
    document.getElementById("quoteDisplay").innerText = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  document.getElementById("quoteDisplay").innerText =
    `"${filteredQuotes[randomIndex].text}" — ${filteredQuotes[randomIndex].category}`;
}

// === Add new quote ===
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  alert("Quote added successfully!");
  postQuoteToServer({ text, category });
}

// === Save quotes locally ===
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// === Populate category dropdown ===
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const existing = select.value;
  select.innerHTML = `<option value="all">All Categories</option>`;
  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
  select.value = existing || lastFilter;
}

// === Filter quotes ===
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastFilter", selectedCategory);
  lastFilter = selectedCategory;
  showRandomQuote();
}

// === Export quotes to JSON ===
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
  URL.revokeObjectURL(url);
}

// === Import quotes from JSON ===
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch {
      alert("Error importing file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// === Fetch quotes from mock server ===
async function fetchQuotesFromServer() {
  const status = document.getElementById("syncStatus");
  status.textContent = "Fetching quotes from server...";
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    const serverQuotes = data.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));
    status.textContent = "Quotes fetched from server.";
    return serverQuotes;
  } catch (err) {
    status.textContent = "Failed to fetch server quotes.";
    return [];
  }
}

// === Post new quote to server ===
async function postQuoteToServer(quote) {
  const status = document.getElementById("syncStatus");
  try {
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote)
    });
    status.textContent = "Quote synced to server.";
    setTimeout(() => (status.textContent = ""), 3000);
  } catch {
    status.textContent = "Failed to sync quote to server.";
  }
}

// === Sync quotes with server (conflict resolution) ===
async function syncQuotes() {
  const status = document.getElementById("syncStatus");
  status.textContent = "Syncing with server...";
  const serverQuotes = await fetchQuotesFromServer();

  // Simple conflict resolution: Server quotes override any with category 'Server'
  quotes = [...quotes.filter(q => q.category !== "Server"), ...serverQuotes];
  saveQuotes();
  populateCategories();
  status.textContent = "Sync complete — Server data updated.";
  setTimeout(() => (status.textContent = ""), 4000);
}

// === Periodically sync every 30 seconds ===
setInterval(syncQuotes, 30000);
