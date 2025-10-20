// =======================================
// Dynamic Quote Generator with Filtering
// =======================================

// Load quotes from local storage, or use defaults if none exist
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to invent it.", category: "Motivation" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" }
];

// Load last selected category from localStorage (for persistence)
let lastSelectedCategory = localStorage.getItem("lastSelectedCategory") || "all";

// Reference main DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const categoryFilter = document.getElementById("categoryFilter");

// ----------------------------
// Save quotes to local storage
// ----------------------------
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ----------------------------
// STEP 1: Populate categories dynamically
// ----------------------------
function populateCategories() {
  // Clear existing dropdown items
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  // Extract unique categories from quotes
  const categories = [...new Set(quotes.map(q => q.category))];

  // Add each category as an option in the dropdown
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore last selected category if available
  categoryFilter.value = lastSelectedCategory;
}

// ----------------------------
// STEP 2: Show a random quote
// ----------------------------
function showRandomQuote() {
  let filteredQuotes = quotes;

  // Filter quotes if a specific category is selected
  const selectedCategory = categoryFilter.value;
  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  // Handle empty filter result
  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  // Select and display a random quote
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <p style="color:#666; font-size:0.9em;">— ${quote.category}</p>
  `;

  // Save last viewed quote in session storage (optional)
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// ----------------------------
// STEP 3: Filter quotes based on selected category
// ----------------------------
function filterQuotes() {
  const selectedCategory = categoryFilter.value;

  // Save selected category to local storage (for persistence)
  localStorage.setItem("lastSelectedCategory", selectedCategory);

  // Show a new random quote in the selected category
  showRandomQuote();
}

// ----------------------------
// STEP 4: Add new quotes dynamically
// ----------------------------
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newQuoteText === "" || newQuoteCategory === "") {
    alert("Please enter both a quote and category!");
    return;
  }

  // Add new quote
  quotes.push({ text: newQuoteText, category: newQuoteCategory });
  saveQuotes();

  // Update dropdown if new category introduced
  populateCategories();

  // Show the newly added quote
  quoteDisplay.innerHTML = `
    <p>"${newQuoteText}"</p>
    <p style="color:#666; font-size:0.9em;">— ${newQuoteCategory}</p>
  `;

  // Clear inputs
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// ----------------------------
// STEP 5: Export quotes as JSON file
// ----------------------------
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

// ----------------------------
// STEP 6: Import quotes from JSON file
// ----------------------------
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      alert("Quotes imported successfully!");
    } catch (err) {
      alert("Invalid JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ----------------------------
// STEP 7: Initialize the app
// ----------------------------
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();               // Load categories
  categoryFilter.value = lastSelectedCategory; // Restore previous filter
  showRandomQuote();                  // Display a quote on load
});

// ----------------------------
// STEP 8: Event listeners
// ----------------------------
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
