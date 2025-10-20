// Dynamic Quote Generator App

// STEP 1: Create and add main title

//Create an <h1> element
const title = document.createElement("h1");
// Set the text inside it
title.textContent = "Dynamic Quote Generator";
// Add it to the <body> of the page
document.body.appendChild(title);

//STEP 2: Create quote display section

//Create a <div> element where quotes will appear
const quoteDisplay = document.createElement("div");
//Give it an ID (to identify it later if needed)
quoteDisplay.id = "quoteDisplay";
// Add some default text
quoteDisplay.textContent = "Click 'Show New Quote' to begin!";
// Insert this div into the page
document.body.appendChild(quoteDisplay);

//STEP 3: Create "Show New Quote" button

//Create a <button> element
const newQuoteBtn = document.createElement("button");
//Give it an ID
newQuoteBtn.textContent = "Show New Quote";
//Append it to page
document.body.appendChild(newQuoteBtn);


// ----------------------------
// STEP 4: Create section to add new quotes dynamically
// ----------------------------

// Create a <div> container for form inputs
const addSection = document.createElement("div");

// Use innerHTML to add all form elements inside this div
addSection.innerHTML = `
  <h2>Add a New Quote</h2>
  <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
  <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
  <button id="addQuoteBtn">Add Quote</button>
`;

// Add this section to the page
document.body.appendChild(addSection);


// ----------------------------
// STEP 5: (Optional) Add simple inline styling with JavaScript
// ----------------------------

// These styles make the app look clean and centered
document.body.style.fontFamily = "Arial, sans-serif";
document.body.style.textAlign = "center";
document.body.style.padding = "40px";
quoteDisplay.style.margin = "20px auto";
quoteDisplay.style.padding = "20px";
quoteDisplay.style.border = "1px solid #ccc";
quoteDisplay.style.width = "60%";
quoteDisplay.style.borderRadius = "10px";
quoteDisplay.style.backgroundColor = "#f9f9f9";


// ----------------------------
// STEP 6: Create an array of quote objects
// ----------------------------

// Each quote has text and a category
const quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Motivation" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" }
];


// ----------------------------
// STEP 7: Function to show a random quote
// ----------------------------
function showRandomQuote() {
  // If there are no quotes available
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available!";
    return; // Exit the function early
  }

  // Get a random number within the array length
  const randomIndex = Math.floor(Math.random() * quotes.length);
  // Pick a quote using that random index
  const quote = quotes[randomIndex];

  // Clear any previous content inside quoteDisplay
  quoteDisplay.innerHTML = "";

  // Create a paragraph for the quote text
  const quoteText = document.createElement("p");
  quoteText.textContent = `"${quote.text}"`;

  // Create another paragraph for the quote category
  const quoteCategory = document.createElement("p");
  quoteCategory.textContent = `— ${quote.category}`;
  // Add inline styles to category text
  quoteCategory.style.color = "#666";
  quoteCategory.style.fontSize = "0.9em";

  // Add both paragraphs into the quoteDisplay div
  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}


// ----------------------------
// STEP 8: Function to add a new quote dynamically
// ----------------------------
function addQuote() {
  // Get the values entered in the input fields
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  // Check that both fields are filled
  if (newQuoteText === "" || newQuoteCategory === "") {
    alert("Please enter both quote text and category!");
    return;
  }

  // Create a new quote object and add it to the array
  quotes.push({ text: newQuoteText, category: newQuoteCategory });

  // Clear the input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  // Give user feedback
  alert("Quote added successfully!");
}


// ----------------------------
// STEP 9: Add event listeners to handle button clicks
// ----------------------------

// When the "Show New Quote" button is clicked → showRandomQuote() runs
newQuoteBtn.addEventListener("click", showRandomQuote);

// When the "Add Quote" button is clicked → addQuote() runs
document.getElementById("addQuoteBtn").addEventListener("click", addQuote)