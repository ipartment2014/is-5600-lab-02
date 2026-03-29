/* add your code here */

// ── Helper Functions (defined outside DOMContentLoaded) ──────────────

/**
 * Loops through the users and renders a ul with li elements for each user
 * Clears the list before re-rendering to prevent duplicates
 */
function generateUserList(users, stocks) {
  const userList = document.querySelector('.user-list');
  userList.innerHTML = '';

  users.map(({ user, id }) => {
    const listItem = document.createElement('li');
    listItem.innerText = user.lastname + ', ' + user.firstname;
    listItem.setAttribute('id', id);
    userList.appendChild(listItem);
  });

  // Register click event listener on the list using event delegation
  userList.addEventListener('click', (event) => handleUserListClick(event, users, stocks));
}

/**
 * Handles the click event on the user list
 * Finds the selected user and populates the form and portfolio
 */
function handleUserListClick(event, users, stocks) {
  const userId = event.target.id;
  // Use loose equality (==) because id is a number but event target id is a string
  const user = users.find(user => user.id == userId);
  if (!user) return; // Guard clause: do nothing if no user found
  populateForm(user);
  renderPortfolio(user, stocks);
}

/**
 * Populates the user form with the selected user's data
 */
function populateForm(data) {
  const { user, id } = data;
  document.querySelector('#userID').value = id;
  document.querySelector('#firstname').value = user.firstname;
  document.querySelector('#lastname').value = user.lastname;
  document.querySelector('#address').value = user.address;
  document.querySelector('#city').value = user.city;
  document.querySelector('#email').value = user.email;
}

/**
 * Renders the portfolio items for the selected user
 * Each item shows the stock symbol, shares owned, and a View button
 */
function renderPortfolio(user, stocks) {
  const { portfolio } = user;
  const portfolioDetails = document.querySelector('.portfolio-list');
  // Clear previous portfolio before rendering new one
  portfolioDetails.innerHTML = '';

  portfolio.map(({ symbol, owned }) => {
    const symbolEl = document.createElement('p');
    const sharesEl = document.createElement('p');
    const actionEl = document.createElement('button');
    symbolEl.innerText = symbol;
    sharesEl.innerText = owned;
    actionEl.innerText = 'View';
    actionEl.setAttribute('id', symbol);
    portfolioDetails.appendChild(symbolEl);
    portfolioDetails.appendChild(sharesEl);
    portfolioDetails.appendChild(actionEl);
  });

  // Use event delegation to handle View button clicks
  portfolioDetails.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      viewStock(event.target.id, stocks);
    }
  });
}

/**
 * Displays the stock details for the selected symbol
 * Finds the matching stock in the stocks array and updates the DOM
 */
function viewStock(symbol, stocks) {
  const stockArea = document.querySelector('.stock-form');
  if (stockArea) {
    const stock = stocks.find(s => s.symbol == symbol);
    document.querySelector('#stockName').textContent = stock.name;
    document.querySelector('#stockSector').textContent = stock.sector;
    document.querySelector('#stockIndustry').textContent = stock.subIndustry;
    document.querySelector('#stockAddress').textContent = stock.address;
    document.querySelector('#logo').src = `logos/${symbol}.svg`;
  }
}

// ── Main Entry Point ──────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  // Parse JSON data from the included data files (stockContent and userContent
  // are global variables declared in data/stocks-complete.js and data/users.js)
  const stocksData = JSON.parse(stockContent);
  const userData = JSON.parse(userContent);

  // Initial render of the user list
  generateUserList(userData, stocksData);

  // Handle Delete button: removes the selected user from the array and re-renders the list
  const deleteButton = document.querySelector('.btn-delete');
  deleteButton.addEventListener('click', (event) => {
    event.preventDefault();
    const userId = document.querySelector('#userID').value;
    const userIndex = userData.findIndex(user => user.id == userId);
    userData.splice(userIndex, 1);
    generateUserList(userData, stocksData);
  });

  // Handle Save button: updates the selected user's data and re-renders the list
  const saveButton = document.querySelector('.btn-save');
  saveButton.addEventListener('click', (event) => {
    event.preventDefault();
    const id = document.querySelector('#userID').value;
    for (let i = 0; i < userData.length; i++) {
      if (userData[i].id == id) {
        userData[i].user.firstname = document.querySelector('#firstname').value;
        userData[i].user.lastname  = document.querySelector('#lastname').value;
        userData[i].user.address   = document.querySelector('#address').value;
        userData[i].user.city      = document.querySelector('#city').value;
        userData[i].user.email     = document.querySelector('#email').value;
        generateUserList(userData, stocksData);
      }
    }
  });

});