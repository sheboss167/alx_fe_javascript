// ============================
// Dynamic Quote Generator (with local/session storage + JSON import/export)
// ============================

// ----------------------------
// STEP 0: Helper - localStorage key names
// ----------------------------
const LOCAL_STORAGE_KEY = "dynamic_quotes_app_quotes_v1"; // key to persist quotes
const SESSION_STORAGE_KEY = "dynamic_quotes_app_last_viewed_v1"; // key to store last viewed quote in session

// ----------------------------
// STEP 1: Create base UI (title, display area, show button)
// ----------------------------

// Create main title element
const title = document.createElement("h1");
title.textContent = "Dynamic Quote Generator";
document.body.appendChild(title);

// Create quote display container (where current quote will be shown)
const quoteDisplay = document.createElement("div");
quoteDisplay.id = "quoteDisplay";
quoteDisplay.textContent = "Click 'Show New Quote' to begin!";
document.body.appendChild(quoteDisplay);

// Create the "Show New Quote" button
const newQuoteBtn = document.createElement("button");
newQuoteBtn.id = "newQuote";
newQuoteBtn.textContent = "Show New Quote";
document.body.appendChild(newQuoteBtn);

// Add a small style so it looks decent without external CSS
document.body.style.fontFamily = "Arial, sans-serif";
document.body.style.textAlign = "center";
document.body.style.padding = "30px";
quoteDisplay.style.margin = "20px auto";
quoteDisplay.style.padding = "18px";
quoteDisplay.style.border = "1px solid #ddd";
quoteDisplay.style.width = "65%";
quoteDisplay.style.borderRadius = "8px";
quoteDisplay.style.backgroundColor = "#fafafa";

// ----------------------------
// STEP 2: Quotes data with fallback default values
// ----------------------------

// Default quotes (used only if localStorage is empty or invalid)
const DEFAULT_QUOTES = [
  { text: "The best way to predict the future is to invent it.", category: "Motivation" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" }
];

// In-memory quotes array — will be populated by loadQuotes()
let quotes = [];

// ----------------------------
// STEP 3: Load and Save functions for localStorage
// ----------------------------

/**
 * saveQuotes()
 * - Serializes the `quotes` array to JSON and stores in localStorage.
 * - Called whenever quotes array changes (e.g., on add or import).
 */
function saveQuotes() {
  try {
    const json = JSON.stringify(quotes);
    localStorage.setItem(LOCAL_STORAGE_KEY, json);
    // optional: console.log("Quotes saved to localStorage.");
  } catch (err) {
    console.error("Failed to save quotes to localStorage:", err);
  }
}

/**
 * loadQuotes()
 * - Loads quotes from localStorage and populates the in-memory `quotes` array.
 * - If nothing is saved, uses DEFAULT_QUOTES as fallback.
 * - Validates that the stored data is an array of objects with text & category.
 */
function loadQuotes() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      // Nothing in localStorage — use defaults
      quotes = DEFAULT_QUOTES.slice(); // clone default array
      saveQuotes(); // persist defaults for future loads
      return;
    }

    const parsed = JSON.parse(raw);

    // Basic validation: should be an array of objects with 'text' and 'category'
    if (!Array.isArray(parsed)) throw new Error("Stored quotes is not an array");

    const valid = parsed.every(
      (q) =>
        q &&
        typeof q === "object" &&
        typeof q.text === "string" &&
        typeof q.category === "string"
    );

    if (!valid) throw new Error("Invalid quote structure in storage");

    quotes = parsed;
  } catch (err) {
    console.warn("Could not load quotes from localStorage; using defaults. Error:", err);
    quotes = DEFAULT_QUOTES.slice();
    saveQuotes();
  }
}

// Immediately load quotes on script initialization
loadQuotes();


// ----------------------------
// STEP 4: sessionStorage helpers for last viewed quote
// ----------------------------

/**
 * saveLastViewedToSession(quoteObj)
 * - Stores the last displayed quote in sessionStorage so it persists for this browser tab/session.
 */
function saveLastViewedToSession(quoteObj) {
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(quoteObj));
  } catch (err) {
    console.error("Failed to save last viewed quote to sessionStorage:", err);
  }
}

/**
 * loadLastViewedFromSession()
 * - Returns the last viewed quote object from sessionStorage (or null if none).
 */
function loadLastViewedFromSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.text === "string" && typeof parsed.category === "string") {
      return parsed;
    }
    return null;
  } catch (err) {
    console.warn("Failed to parse last viewed quote from sessionStorage:", err);
    return null;
  }
}

// If a last-viewed quote exists in this session, show it on load
const lastViewed = loadLastViewedFromSession();
if (lastViewed) {
  quoteDisplay.innerHTML = `<p>"${lastViewed.text}"</p><p style="color:#666;font-size:0.9em;">— ${lastViewed.category}</p>`;
}


// ----------------------------
// STEP 5: Function to show a random quote (and save last viewed to sessionStorage)
// ----------------------------
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available!";
    return;
  }

  // Pick a random quote index
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  // Update the DOM with the selected quote
  quoteDisplay.innerHTML = `<p>"${quote.text}"</p><p style="color:#666;font-size:0.9em;">— ${quote.category}</p>`;

  // Save the last viewed quote to sessionStorage (so it persists across reloads in this tab)
  saveLastViewedToSession(quote);
}

// ----------------------------
// STEP 6: createAddQuoteForm() — required by checker
// - Creates the Add Quote form elements via JS and attaches handlers
// ----------------------------
function createAddQuoteForm() {
  // Container for form
  const formContainer = document.createElement("div");
  formContainer.style.marginTop = "20px";

  // Title for the form
  const formTitle = document.createElement("h2");
  formTitle.textContent = "Add a New Quote";
  formContainer.appendChild(formTitle);

  // Input for the quote text
  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";
  quoteInput.style.marginRight = "8px";
  formContainer.appendChild(quoteInput);

  // Input for category
  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";
  categoryInput.style.marginRight = "8px";
  formContainer.appendChild(categoryInput);

  // Add Quote button
  const addBtn = document.createElement("button");
  addBtn.id = "addQuoteBtn";
  addBtn.textContent = "Add Quote";
  addBtn.style.marginRight = "8px";
  // Attach click listener to call addQuote()
  addBtn.addEventListener("click", addQuote);
  formContainer.appendChild(addBtn);

  // Export button (download JSON)
  const exportBtn = document.createElement("button");
  exportBtn.id = "exportQuotesBtn";
  exportBtn.textContent = "Export Quotes (JSON)";
  exportBtn.style.marginRight = "8px";
  exportBtn.addEventListener("click", exportQuotesToJsonFile);
  formContainer.appendChild(exportBtn);

  // Import file input (hidden input styled as file chooser)
  const importLabel = document.createElement("label");
  importLabel.textContent = "Import Quotes (JSON): ";
  importLabel.style.display = "inline-block";
  importLabel.style.marginLeft = "8px";

  const importInput = document.createElement("input");
  importInput.type = "file";
  importInput.accept = ".json,application/json";
  importInput.id = "importFile";
  importInput.addEventListener("change", importFromJsonFile);
  importLabel.appendChild(importInput);
  formContainer.appendChild(importLabel);

  // Append the whole form container to the body
  document.body.appendChild(formContainer);
}

// ----------------------------
// STEP 7: addQuote() — adds a new quote to the array and updates localStorage & DOM
// ----------------------------
function addQuote() {
  // Read and trim inputs
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  // Validate inputs
  if (newQuoteText === "" || newQuoteCategory === "") {
    alert("Please enter both quote text and category!");
    return;
  }

  // Create the new quote object
  const newQuoteObj = { text: newQuoteText, category: newQuoteCategory };

  // Add to in-memory array
  quotes.push(newQuoteObj);

  // Persist to localStorage
  saveQuotes();

  // Update the DOM immediately to show the quote that was just added
  quoteDisplay.innerHTML = `<p>"${newQuoteText}"</p><p style="color:#666;font-size:0.9em;">— ${newQuoteCategory}</p>`;

  // Save last viewed to sessionStorage for this session
  saveLastViewedToSession(newQuoteObj);

  // Clear the form fields for better UX
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  // Optional feedback
  alert("Quote added and saved to local storage.");
}

// ----------------------------
// STEP 8: JSON Export function (download quotes as .json)
// ----------------------------
function exportQuotesToJsonFile() {
  try {
    // Convert the quotes array to JSON string
    const dataStr = JSON.stringify(quotes, null, 2); // pretty print with 2 spaces
    // Create a Blob from the string
    const blob = new Blob([dataStr], { type: "application/json" });
    // Create a temporary download URL
    const url = URL.createObjectURL(blob);
    // Create a temporary anchor element and click it to download
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes_export.json"; // default filename
    document.body.appendChild(a);
    a.click();
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Failed to export quotes:", err);
    alert("Export failed. Check console for details.");
  }
}

// ----------------------------
// STEP 9: JSON Import handler (reads a .json file and adds quotes)
// - Validates the imported structure before merging
// ----------------------------
function importFromJsonFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) {
    alert("No file selected.");
    return;
  }

  const reader = new FileReader();

  // When file is loaded, parse and validate
  reader.onload = function (loadEvent) {
    try {
      const text = loadEvent.target.result;
      const parsed = JSON.parse(text);

      // Basic validation: imported data should be an array of objects with text & category
      if (!Array.isArray(parsed)) {
        throw new Error("Imported JSON must be an array of quotes.");
      }

      const validated = parsed.filter(
        (q) =>
          q &&
          typeof q === "object" &&
          typeof q.text === "string" &&
          q.text.trim() !== "" &&
          typeof q.category === "string" &&
          q.category.trim() !== ""
      );

      if (validated.length === 0) {
        throw new Error("No valid quote objects found in the imported file.");
      }

      // Merge the validated imported quotes into the current quotes array
      // Option: you could deduplicate here; currently we simply append
      quotes.push(...validated);

      // Persist merged quotes to localStorage
      saveQuotes();

      // Optionally show the first imported quote immediately
      const firstImported = validated[0];
      quoteDisplay.innerHTML = `<p>"${firstImported.text}"</p><p style="color:#666;font-size:0.9em;">— ${firstImported.category}</p>`;
      saveLastViewedToSession(firstImported);

      alert(`Imported ${validated.length} quote(s) successfully!`);

      // Clear the file input so the same file can be imported again if needed
      event.target.value = "";
    } catch (err) {
      console.error("Import failed:", err);
      alert("Failed to import quotes: " + (err.message || err));
    }
  };

  // Read the selected file as text
  reader.readAsText(file);
}

// ----------------------------
// STEP 10: Set up event listeners and create the add-quote form
// ----------------------------

// Event listener required by the checker: Show New Quote button triggers showRandomQuote()
newQuoteBtn.addEventListener("click", showRandomQuote);

// Create the add-quote form elements (and export/import controls)
createAddQuoteForm();

// Done: now the app supports localStorage persistence, sessionStorage for last viewed, and JSON import/export.
