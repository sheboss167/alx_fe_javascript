// ===== Dynamic Quote Generator with Server Sync =====

// Initialize quotes array from local storage or with defaults
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don't let yesterday take up too much of today.", category: "Inspiration" },
  { text: "It's not whether you get knocked down, it's whether you get up.", category: "Perseverance" }
];

// Load last selected category filter
let lastFilter = localStorage.getItem("lastFilter") || "all";
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  filterQuotes();
  document.getElementById("categoryFilter").value = lastFilter;
});

// === Event listeners ===
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("exportQuotes").addEventListener("click", exportToJsonFile);

// === Display a random quote ===
function showRandomQuote() {
  const category = document.getElementById("categoryFilter").value;
  let filteredQuotes =
    category === "all" ? quotes : quotes.filter(q => q.category === category);

  if (filteredQuotes.length === 0) {
    document.getElementById("quoteDisplay").innerText =
      "No quotes available for this category.";
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
}

// === Save quotes to localStorage ===
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

// === Filter quotes by category ===
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastFilter", selectedCategory);
  lastFilter = selectedCategory;
  showRandomQuote();
}

// === Export quotes to JSON file ===
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

// === Import quotes from JSON file ===
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
    } catch (err) {
      alert("Error importing file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// === Simulate server sync (JSONPlaceholder) ===
async function syncWithServer() {
  const status = document.getElementById("syncStatus");
  status.textContent = "Syncing with server...";

  try {
    // Simulate fetching quotes from server
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const serverData = await response.json();

    // Simulate extracting new server quotes (we’ll just take the first few titles)
    const serverQuotes = serverData.slice(0, 3).map(post => ({
      text: post.title,
      category: "Server"
    }));

    // Conflict resolution: Server data takes precedence
    const combined = [...quotes.filter(q => q.category !== "Server"), ...serverQuotes];
    quotes = combined;
    saveQuotes();
    populateCategories();

    status.textContent = "Sync complete — Server data synced.";
    setTimeout(() => (status.textContent = ""), 3000);
  } catch (err) {
    status.textContent = "Sync failed. Please check your connection.";
  }
}

// Periodically sync every 30 seconds
setInterval(syncWithServer, 30000);
