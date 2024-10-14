import data from "../json/data.json" with {type: 'json'};

document.addEventListener("DOMContentLoaded", () => {
    // Fetch the JSON data
    fetch('../json/data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {

            let savedBooks = localStorage.getItem('books');

            // Check if books are already saved in localStorage
            if (!savedBooks) {
                // Save the fetched books into localStorage
                localStorage.setItem('books', JSON.stringify(data.books));
                displayBooks(data.books); // Display books from fetched data
            } else {
                // If books already exist in localStorage, display those
                displayBooks(JSON.parse(savedBooks));
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    const bookShow = document.getElementById("bookShow");
    bookShow.style.display = "none";
});

// Function to display books in the table
function displayBooks(books) {
    const booksList = document.getElementById("booklistTbody");
    booksList.innerHTML = ""; // Clear existing rows

    books.forEach(book => {
        const row = document.createElement("tr");

        const bookTdId = document.createElement("td");
        bookTdId.innerText = book.id;

        const bookTdTitle = document.createElement("td");
        bookTdTitle.innerText = book.title

        const bookTdPrice = document.createElement("td");
        bookTdPrice.innerText = '$' + book.price;

        const bookTdCrud = document.createElement("td");
        bookTdCrud.classList = "crud-options";

        const readBookSpan = document.createElement("span");
        readBookSpan.classList = "crud-option";
        readBookSpan.innerText = "Read";

        const updateBookSpan = document.createElement("span");
        updateBookSpan.classList = "crud-option";
        updateBookSpan.innerText = "Update";

        const deleteBookSpan = document.createElement("span");
        deleteBookSpan.classList = "crud-option";
        deleteBookSpan.innerText = "🗑️";


        bookTdCrud.appendChild(readBookSpan);
        bookTdCrud.appendChild(updateBookSpan);
        bookTdCrud.appendChild(deleteBookSpan);

        row.appendChild(bookTdId);
        row.appendChild(bookTdTitle);
        row.appendChild(bookTdPrice);
        row.appendChild(bookTdCrud);


        booksList.appendChild(row);

        readBookSpan.addEventListener('click', () => {
            readBook(book.id);
        });

        updateBookSpan.addEventListener('click', () => {
            updateBook(book.id);
        });
        deleteBookSpan.addEventListener('click', () => {
            deleteBook(book.id);
        });

    });
}

// CRUD functions (read, update, delete)
function readBook(id) {
    alert(`Reading book with ID: ${id}`);


}

function updateBook(id) {
    alert(`Updating book with ID: ${id}`);
}

function deleteBook(id) {
    const confirmation = confirm(`Are you sure you want to delete book with ID: ${id}?`);
    if (confirmation) {
        const row = document.querySelector(`#booksTable tbody tr:nth-child(${id})`);
        if (row) {
            row.remove();
        }
    }
}

// Sort function (existing code)
let titleSortDirection = true; // true for ascending, false for descending
let priceSortDirection = true;

function sortBooks(property) {
    if (property === 'title') {
        titleSortDirection = !titleSortDirection; // Toggle sort direction
        books.sort((a, b) => titleSortDirection ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title));
        document.getElementById("titleArrow").innerHTML = titleSortDirection ? '▲' : '▼'; // Change arrow direction
    } else if (property === 'price') {
        priceSortDirection = !priceSortDirection; // Toggle sort direction
        books.sort((a, b) => priceSortDirection ? a.price - b.price : b.price - a.price);
        document.getElementById("priceArrow").innerHTML = priceSortDirection ? '▲' : '▼'; // Change arrow direction
    }
    displayBooks(); // Refresh the book list
}


let currentRate = 0; // Initial rate value

function changeRate(change) {
    // Update current rate based on button click
    currentRate += change;

    // Ensure the rate stays within the desired limits (0-10)
    if (currentRate < 0) {
        currentRate = 0;
    } else if (currentRate > 10) {
        currentRate = 10;
    }

    // Update the displayed rate value
    document.getElementById("rateValueLabel").textContent = currentRate;
}