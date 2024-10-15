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

    const bookShowContent = document.getElementById("bookShowContent");
    bookShowContent.style.display = "none";

    // Add sorting event listeners to title and price arrows
    const titleArrow = document.getElementById('titleArrow');
    const priceArrow = document.getElementById('priceArrow');

    titleArrow.addEventListener('click', () => {
        sortBooks('title');
    });

    priceArrow.addEventListener('click', () => {
        sortBooks('price');
    });

    // Event listener for the "+ New book" button
    const newBookLink = document.getElementById('newBookLink');

    // Prevent default behavior and stop propagation of other listeners
    newBookLink.addEventListener('click', (event) => {
        event.preventDefault();  // Prevent any default link behavior
        event.stopPropagation(); // Stop any other events related to the link
        showForm('Add');         // Open the form
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



        bookTdCrud.appendChild(readBookSpan);
        bookTdCrud.appendChild(updateBookSpan);
        bookTdCrud.appendChild(deleteBookSpan);

        row.appendChild(bookTdId);
        row.appendChild(bookTdTitle);
        row.appendChild(bookTdPrice);
        row.appendChild(bookTdCrud);

        booksList.appendChild(row);

        readBookSpan.addEventListener('click', () => {
            readBook(book);
        });

        updateBookSpan.addEventListener('click', () => {
            showForm('Update', book);
        });
        deleteBookSpan.addEventListener('click', () => {
            deleteBook(book);
        });

    });
}

// CRUD functions (read, update, delete)
function addBook(book) {

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
    }
}

function readBook(book) {
    const bookShowContent = document.getElementById("bookShowContent");
    const bookHeader = document.getElementById("bookHeader");
    const bookImg = document.getElementById("bookimg").getElementsByTagName("img")[0];
    const priceValue = document.getElementById("priceValue");
    const rateValueLabel = document.getElementById("rateValueLabel");

    bookHeader.textContent = book.title;
    bookImg.src = book.img || '';
    priceValue.textContent = book.price;
    rateValueLabel.innerText = book.rate || 0;

    document.getElementById('closeShowbook').addEventListener('click', () => {
        bookShowContent.style.display = 'none';
    });

    // Reset event listeners for rate buttons
    const plusButton = document.getElementById('plusButton');
    const minusButton = document.getElementById('minusButton');

    plusButton.replaceWith(plusButton.cloneNode(true));
    minusButton.replaceWith(minusButton.cloneNode(true));

    document.getElementById('plusButton').addEventListener('click', () => {
        changeRate(1, book);
    });
    document.getElementById('minusButton').addEventListener('click', () => {
        changeRate(-1, book);
    });

    bookShowContent.style.display = "block";
}



function updateBook(book) {
    let storedBooks = localStorage.getItem('books');
    books = storedBooks ? JSON.parse(storedBooks) : [];

    const existingItem = books.find(bookItem => String(bookItem.id) === String(book.id));

    if (existingItem) {
        // Update the book details
        existingItem.title = book.title;
        existingItem.price = book.price;
        existingItem.img = book.img;

        // Save the updated books to localStorage
        localStorage.setItem('books', JSON.stringify(books));

        // Re-render the table with the updated data
        displayBooks(books);

        alert("Updated book with ID: " + book.id);
    } else {
        alert("Book not found");
    }
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
function showForm(type, book = null) {
    const modalContentWrapper = document.createElement('div');
    modalContentWrapper.classList.add('modal-content-wrapper');

    const modal = document.createElement('div');
    modal.id = "myModal";
    modal.classList.add('modal');

    const popNav = document.createElement('div');
    popNav.id = "popNav";
    popNav.classList.add('popNav');

    const closebtn = document.createElement('btn');
    closebtn.classList.add('close');
    closebtn.innerHTML = "X";
    closebtn.onclick = function () {
        modal.style.display = "none";
    };
    popNav.appendChild(closebtn);

    const popContent = document.createElement('div');
    popContent.id = "popContent";
    popContent.classList.add('modal-content');

    const popParagraph = document.createElement('p');
    popParagraph.id = "popParagraph";
    popParagraph.classList.add('popContent');
    popParagraph.innerText = type === 'Add' ? '+ New Book' : 'Update Book'; // Title based on form type

    popContent.appendChild(popParagraph); // Add the title to the form first

    // Only show the Id label and input when adding a new book
    if (type === 'Add') {
        const popIdLabel = document.createElement('label');
        popIdLabel.id = "popIdLabel";
        popIdLabel.classList.add('popLabel');
        popIdLabel.innerText = "Id";

        const popIdInput = document.createElement('input');
        popIdInput.id = "popIdInput";
        popIdInput.classList.add('popInput');
        popIdInput.type = "text";

        // Append the input to the label (this step was missing in the original code)
        popContent.appendChild(popIdLabel);
        popContent.appendChild(popIdInput); // Correct place to append the input
    }

    const popTitleLabel = document.createElement('label');
    popTitleLabel.id = "popTitleLabel";
    popTitleLabel.classList.add('popLabel');
    popTitleLabel.innerText = "Title";
    const popTitleInput = document.createElement('input');
    popTitleInput.id = "popTitleInput";
    popTitleInput.classList.add('popInput');
    popTitleInput.type = "text";
    popTitleInput.value = book ? book.title : ''; // Prefill if updating
    popTitleLabel.appendChild(popTitleInput);

    const popPriceLabel = document.createElement('label');
    popPriceLabel.id = "popPriceLabel";
    popPriceLabel.classList.add('popLabel');
    popPriceLabel.innerText = "Price";
    const popPriceInput = document.createElement('input');
    popPriceInput.id = "popPriceInput";
    popPriceInput.classList.add('popInput');
    popPriceInput.type = "text";
    popPriceInput.value = book ? book.price : ''; // Prefill if updating
    popPriceLabel.appendChild(popPriceInput);

    const popImgUrlLabel = document.createElement('label');
    popImgUrlLabel.id = "popImgUrlLabel";
    popImgUrlLabel.classList.add('popLabel');
    popImgUrlLabel.innerText = "Cover Image URL";
    const popImgUrlInput = document.createElement('input');
    popImgUrlInput.id = "popImgUrlInput";
    popImgUrlInput.classList.add('popInput');
    popImgUrlInput.type = "text";
    popImgUrlInput.value = book ? book.img : ''; // Prefill if updating
    popImgUrlLabel.appendChild(popImgUrlInput);

    const popBtn = document.createElement('button');
    popBtn.id = "popBtn";
    popBtn.classList.add('popBtn');
    popBtn.innerText = type === 'Add' ? 'Add' : 'Update'; // Button text based on form type

    // Attach the correct event listener based on form type
    if (type === 'Add') {
        popBtn.addEventListener('click', (event) => {
            event.preventDefault();
            addBook({
                id: popIdInput.value, 
                title: popTitleInput.value,
                price: popPriceInput.value,
                img: popImgUrlInput.value
            });
            modal.style.display = "none"; // Close the modal
        });
    } else if (type === 'Update') {
        popBtn.addEventListener('click', (event) => {
            event.preventDefault();
            updateBook({
                id: book.id, // Use the original book's id for the update
                title: popTitleInput.value,
                price: popPriceInput.value,
                img: popImgUrlInput.value
            });
            modal.style.display = "none"; // Close the modal
        });
    }
    // Append everything to the modal content
    popContent.appendChild(popTitleLabel);
    popContent.appendChild(popPriceLabel);
    popContent.appendChild(popImgUrlLabel);
    popContent.appendChild(popBtn);
    modalContentWrapper.appendChild(popNav);
    modalContentWrapper.appendChild(popContent);
    modal.appendChild(modalContentWrapper);

    // Append the modal to the body
    document.body.appendChild(modal);

    // Show the modal
    modal.style.display = "block";
}


// Sort function (existing code)
let titleSortDirection = true; // true for ascending, false for descending
let priceSortDirection = true;

function sortBooks(property) {

    let storedBooks = localStorage.getItem('books');
    books = storedBooks ? JSON.parse(storedBooks) : [];

    if (property === 'title') {
        titleSortDirection = !titleSortDirection; // Toggle sort direction
        books.sort((a, b) => titleSortDirection ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title));
        document.getElementById("titleArrow").innerHTML = titleSortDirection ? '▲' : '▼'; // Change arrow direction
    } else if (property === 'price') {
        priceSortDirection = !priceSortDirection; // Toggle sort direction
        books.sort((a, b) => priceSortDirection ? a.price - b.price : b.price - a.price);
        document.getElementById("priceArrow").innerHTML = priceSortDirection ? '▲' : '▼'; // Change arrow direction
    }
    // Save the updated books to localStorage
    localStorage.setItem('books', JSON.stringify(books));

    displayBooks(books); // Refresh the book list
}



function changeRate(change, book) {
    let storedBooks = localStorage.getItem('books');
    let books = storedBooks ? JSON.parse(storedBooks) : [];

    // Find the book in the stored books
    const bookIndex = books.findIndex(bookItem => bookItem.id === book.id);

    if (bookIndex !== -1) {
        // Update current rate based on button click
        let currentRate = books[bookIndex].rate || 0; // Default to 0 if no rate exists
        currentRate += change;

        // Ensure the rate stays within the desired limits (0-10)
        if (currentRate < 0) {
            currentRate = 0;
        } else if (currentRate > 10) {
            currentRate = 10;
        }

        // Update the displayed rate value
        document.getElementById("rateValueLabel").innerText = currentRate;

        // Update the rate value of the book
        books[bookIndex].rate = currentRate;

        // Save the updated books to localStorage
        localStorage.setItem('books', JSON.stringify(books));
    } else {
        console.error('Book not found in localStorage.');
    }
}