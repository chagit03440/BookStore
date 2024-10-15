import data from "../json/data.json" with {type: 'json'};
let books = [];

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

    // Event listener for the "+ New book" button
    const newBookLink = document.getElementById('newBookLink');
    newBookLink.addEventListener('click', () => {
        addBook();
    });
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

        // Create a wrapper for modal content
        const modalContentWrapper = document.createElement('div');
        modalContentWrapper.classList.add('modal-content-wrapper'); // New wrapper class

        // Create the modal container div
        const modal = document.createElement('div');
        modal.id = "myModal";
        modal.classList.add('modal');

        const popNav = document.createElement('div');
        popNav.id = "popNav";
        popNav.classList.add('popNav');


        // Create the close button (span) for the modal
        const closebtn = document.createElement('btn');
        closebtn.classList.add('close');
        closebtn.innerHTML = "X";  // X button to close modal
        closebtn.fdprocessedid = "whwffp";

        popNav.appendChild(closebtn);

        const popContent = document.createElement('div');
        popContent.id = "popContent";
        popContent.classList.add('modal-content');

        const popParagraph = document.createElement('p');
        popParagraph.id = "popParagraph";
        popParagraph.classList.add('popContent');

        const popIdLabel = document.createElement('label');
        popIdLabel.id = "popIdLabel";
        popIdLabel.classList.add('popLabel');
        popIdLabel.innerText = "Id"

        const popIdInput = document.createElement('input');
        popIdInput.id = "popIdInput";
        popIdInput.classList.add('popInput');
        popIdInput.type = "text";

        popIdLabel.appendChild(popIdInput);

        const popTitleLabel = document.createElement('label');
        popTitleLabel.id = "popTitleLabel";
        popTitleLabel.classList.add('popLabel');
        popTitleLabel.innerText = "Title"

        const popTitleInput = document.createElement('input');
        popTitleInput.id = "popTitleInput";
        popTitleInput.classList.add('popInput');
        popTitleInput.type = "text";

        popTitleLabel.appendChild(popTitleInput);

        // Create label for Price
        const popPriceLabel = document.createElement('label');
        popPriceLabel.id = "popPriceLabel";
        popPriceLabel.classList.add('popLabel');
        popPriceLabel.innerText = "Price";

        // Create input for Price
        const popPriceInput = document.createElement('input');
        popPriceInput.id = "popPriceInput";
        popPriceInput.classList.add('popInput');

        // Append input to the label
        popPriceLabel.appendChild(popPriceInput);

        // Create label for Image URL
        const popImgUrlLabel = document.createElement('label');
        popImgUrlLabel.id = "popImgUrlLabel";
        popImgUrlLabel.classList.add('popLabel');
        popImgUrlLabel.innerText = "Cover Image URL";

        // Create input for Image URL
        const popImgUrlInput = document.createElement('input');
        popImgUrlInput.id = "popImgUrlInput";
        popImgUrlInput.classList.add('popInput');
        popImgUrlInput.type = "text";  // Use text type for image URL

        // Append input to the label
        popImgUrlLabel.appendChild(popImgUrlInput);

        const popBtn = document.createElement('button');
        popBtn.id = "popBtn";
        popBtn.classList.add('popBtn');


        popContent.appendChild(popParagraph);
        popContent.appendChild(popIdLabel);
        popContent.appendChild(popTitleLabel);
        popContent.appendChild(popPriceLabel);
        popContent.appendChild(popImgUrlLabel);
        popContent.appendChild(popBtn);

        modalContentWrapper.appendChild(popNav);
        modalContentWrapper.appendChild(popContent);

        // Append the wrapper to the modal
        modal.appendChild(modalContentWrapper);

        bookTdCrud.appendChild(readBookSpan);
        bookTdCrud.appendChild(updateBookSpan);
        bookTdCrud.appendChild(deleteBookSpan);

        row.appendChild(bookTdId);
        row.appendChild(bookTdTitle);
        row.appendChild(bookTdPrice);
        row.appendChild(bookTdCrud);
        row.appendChild(modal);


        booksList.appendChild(row);

        // Close the modal when the close button (X) is clicked
        closebtn.onclick = function () {
            modal.style.display = "none";
        };

        readBookSpan.addEventListener('click', () => {
            readBook(book);
        });

        updateBookSpan.addEventListener('click', () => {
            updateBook(book);
        });
        deleteBookSpan.addEventListener('click', () => {
            deleteBook(book);
        });

    });
}

// CRUD functions (read, update, delete)
function addBook() {

    let book = {};
    const modal = document.getElementById('myModal');
    modal.style.display = "block";

    const popNav = document.getElementById('popParagraph');
    popNav.innerText = "Add Book";

    const popBtn = document.getElementById('popBtn');
    popBtn.innerText = "Add";



    // Remove previous click listeners to prevent multiple triggers
    popBtn.replaceWith(popBtn.cloneNode(true));
    const newPopBtn = document.getElementById('popBtn');

    // Add the event listener for adding a new book
    newPopBtn.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent any default behavior (if form behavior exists)

        // Assign values from the modal's input fields
        book.id = popIdInput.value;
        book.title = poptitleInput.value;
        book.price = popPriceInput.value;
        book.img = popImgUrlInput.value;

        let storedBooks = localStorage.getItem('books');
        books = storedBooks ? JSON.parse(storedBooks) : [];

        const existingItem = books.find(bookItem => bookItem.id === book.id);

        if (existingItem) {
            alert("Book ID already exists");
        } else {
            books.push(book);

            // Save the updated books to localStorage
            localStorage.setItem('books', JSON.stringify(books));

            // Re-render the table with the updated data
            displayBooks(books);

            alert("Added Book with ID: " + book.id);

            // Close the modal
            modal.style.display = "none";
        }
    });
}
function readBook(book) {

}

function updateBook(book) {
    const modal = document.getElementById('myModal');
    modal.style.display = "block";

    const popNav = document.getElementById('popParagraph');
    popNav.innerText = "Update Book";

    const popIdInput = document.getElementById('popIdInput');
    popIdInput.value = book.id;

    const poptitleInput = document.getElementById('popTitleInput');
    poptitleInput.value = book.title;

    const popPriceInput = document.getElementById('popPriceInput');
    popPriceInput.value = book.price;

    const popImgUrlInput = document.getElementById('popImgUrlInput');
    popImgUrlInput.value = book.img;

    const popBtn = document.getElementById('popBtn');
    popBtn.innerText = "Update";

    popBtn.addEventListener('click', () => {
        let storedBooks = localStorage.getItem('books');
        books = storedBooks ? JSON.parse(storedBooks) : [];


        const existingItem = books.find(bookItem => bookItem.id === book.id);

        if (existingItem) {
            existingItem.id = popIdInput.value;
            existingItem.title = poptitleInput.value;
            existingItem.price = popPriceInput.value;
            existingItem.img = popImgUrlInput.value;
        } else {
            alert("book not exist");
        }

        // Save the updated books to localStorage
        localStorage.setItem('books', JSON.stringify(books));

        // Re-render the table with the updated data
        displayBooks(books);

        alert("updated" + book.id);
    });


}

function deleteBook(book) {
    let storedBooks = localStorage.getItem('books');
    books = storedBooks ? JSON.parse(storedBooks) : [];


    // Find the index of the book to be deleted
    const bookIndex = books.findIndex(bookItem => bookItem.id === book.id);

    if (bookIndex !== -1) {
        // Remove the book from the array
        books.splice(bookIndex, 1);

        // Update the localStorage with the new array of books
        localStorage.setItem('books', JSON.stringify(books));

        // Re-render the table with the updated list of books
        displayBooks(books);

        alert(`Deleted book with ID: ${book.id}`);
    } else {
        alert("Book not found!");
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