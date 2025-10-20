// ============================
// Dynamic Quote Generator App
// ============================

// ----------------------------
// STEP 1: Basic setup
// ----------------------------

// Create the main title dynamically
const title = document.createElement("h1");
title.textContent = "Dynamic Quote Generator";
document.body.appendChild(title);

// Create a container to display quotes
const quoteDisplay = document.createElement("div");
quoteDisplay.id = "quoteDisplay";
quoteDisplay.textContent = "Click 'Show New Quote' to begin!";
document.body.appendChild(quoteDisplay);

// Create the "Show New Quote" button
const newQuoteBtn = document.createElement("button");
newQuoteBtn.id = "newQuote";
newQuoteBtn.textContent = "Show New Quote";
document.body.appendChild(newQuoteBtn);

// ----------------------------
// STEP 2: Initialize quotes data
// ----------------------------
const quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Motivation" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" }
];

// ----------------------------
// STEP 3: Function to show a random quote
// ----------------------------
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available!";
    return;
  }

  // Pick a random quote
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  // Clear current display
  quoteDisplay.innerHTML = "";

  // Create paragraph for quote text
  const quoteText = document.createElement("p");
  quoteText.textContent = `"${quote.text}"`;

  // Create paragraph for category
  const quoteCategory = document.createElement("p");
  quoteCategory.textContent = `— ${quote.category}`;
  quoteCategory.style.color = "#666";
  quoteCategory.style.fontSize = "0.9em";

  // Append to quoteDisplay
  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

// ----------------------------
// STEP 4: Function to create the Add Quote form
// ----------------------------
function createAddQuoteForm() {
  // Create a container for the form
  const formContainer = document.createElement("div");

  // Create a title
  const formTitle = document.createElement("h2");
  formTitle.textContent = "Add a New Quote";
  formContainer.appendChild(formTitle);

  // Create text input for quote
  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";
  formContainer.appendChild(quoteInput);

  // Create input for category
  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";
  formContainer.appendChild(categoryInput);

  // Create "Add Quote" button
  const addBtn = document.createElement("button");
  addBtn.textContent = "Add Quote";
  // Add event listener that calls addQuote() when clicked
  addBtn.addEventListener("click", addQuote);
  formContainer.appendChild(addBtn);

  // Append the form to the body
  document.body.appendChild(formContainer);
}

// ----------------------------
// STEP 5: Function to add a new quote dynamically
// ----------------------------
function addQuote() {
  // Get user input values
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  // Validate input
  if (newQuoteText === "" || newQuoteCategory === "") {
    alert("Please enter both quote text and category!");
    return;
  }

  // Add new quote object to the quotes array
  quotes.push({ text: newQuoteText, category: newQuoteCategory });

  // Update the DOM immediately to show new quote
  quoteDisplay.innerHTML = `<p>"${newQuoteText}"</p><p style="color:#666;font-size:0.9em;">— ${newQuoteCategory}</p>`;

  // Clear input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// ----------------------------
// STEP 6: Event listeners
// ----------------------------

// When the "Show New Quote" button is clicked, run showRandomQuote()
newQuoteBtn.addEventListener("click", showRandomQuote);

// Call function to create the Add Quote form dynamically
createAddQuoteForm();
