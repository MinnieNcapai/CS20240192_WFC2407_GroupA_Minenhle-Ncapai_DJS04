// Import data about books, authors, genres, and the number of books to show per page
import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'

// Classes to represent each book, author, and genre
// This class creates a "Book" object with information like ID, title, author, genres, image, etc.
class Book {
     /**
     * Creates a Book instance.
     * @param {string} id - Unique ID for the book.
     * @param {string} title - Title of the book.
     * @param {string} author - ID of the author.
     * @param {Array<string>} genres - Array of genre IDs associated with the book.
     * @param {string} image - Image URL for the book cover.
     * @param {Date} published - Publication date of the book.
     * @param {string} description - Brief description of the book.
     */
    constructor(id, title, author, genres, image, published, description) {
        this.id = id; // Unique ID for the book
        this.title = title; // Title of the book
        this.author = author; //ID of the author
        this.genres = genres; // Array of genre IDs associated with the book
        this.image = image; // Image URL for the book cover
        this.published = published; // Publication date of the book
        this.description = description; // Brief description of the book
        }
    }

// This class creates an "Author" object with ID and name
class Author {
      /**
     * Creates an Author instance.
     * @param {string} id - Unique ID for the author.
     * @param {string} name - Name of the author.
     */
    constructor(id, name) {
        this.id = id; // Unique ID for the author
        this.name = name; // Name of the author
    }
}

// This class creates a "Genre" object with ID and name
class Genre {
      /**
     * Creates a Genre instance.
     * @param {string} id - Unique ID for the genre.
     * @param {string} name - Name of the genre.
     */
    constructor(id, name) {
        this.id = id; // Unique ID for the genre
        this.name = name; // Name of the genre
    }
}

//Intialize Data
//Convert each item in "books" into a Book object and store them in "bookInstances"
const bookInstances = books.map(book => new Book(book.id, book.title, book.author, book.genres, book.image, book.published, book.description));
// Convert each author entry into an Author object and store it in "authorInstances"
const authorInstances = Object.entries(authors).map(([id, name]) => new Author(id, name));
// Convert each genre entry into a Genre object and store them in "genreInstances"
const genreInstances = Object.entries(genres).map(([id, name]) => new Genre(id,name));

//DOM Elements
// Select and store DOM elements for book list, genre filter, author filter, and UI overlays
const listItems = document.querySelector('[data-list-items]'); // Container for displaying book previews
const searchGenres = document.querySelector('[data-search-genres]'); // Dropdown for genre filtering
const searchAuthors = document.querySelector('[data-search-authors]'); // Dropdown for author filtering
const listButton = document.querySelector('[data-list-button]'); // Button to show more books
const searchOverlay = document.querySelector('[data-search-overlay]');  // Overlay for search options
const settingsOverlay = document.querySelector('[data-settings-overlay]'); // Overlay for theme settings
const listActive = document.querySelector('[data-list-active]');  // Modal for displaying active book details
const listMessage = document.querySelector('[data-list-message]'); // Message shown when no books match filters
const settingsForm = document.querySelector('[data-settings-form]');  // Form for theme settings
const searchForm = document.querySelector('[data-search-form]');  // Form for search functionality

// Set up for displaying books
let page = 1; // Keep track of the current page number
let matches = books // Store books to display, starting with all books

// Functions for Repetitive Tasks
// Function to render a list of books using the BookPreview component
/**
 * Renders a list of book previews.
 * @param {Array<Book>} bookList - List of books to display.
 */
const renderBooks = (bookList) => {
    const fragment = document.createDocumentFragment(); // Create a document fragment to hold book previews
// Loop through the sliced book list and create a BookPreview component for each book
    for (const { id, title, author, image } of bookList.slice(0, BOOKS_PER_PAGE)) {
        const bookPreview = document.createElement('book-preview'); // Create a book-preview element
        bookPreview.setAttribute('id', id);  // Set book ID
        bookPreview.setAttribute('title', title); // Set book title
        bookPreview.setAttribute('author', authors[author]);  // Set book author
        bookPreview.setAttribute('image', image); // Set book image
        
// Add event listener for the book-selected event to show book details when clicked
        bookPreview.addEventListener('book-selected', (event) => {
            displayBookDetails(event.detail.id);
        });

        fragment.appendChild(bookPreview); // Append the book preview component to the fragment
    }
    document.querySelector('[data-list-items]').appendChild(fragment); // Append the fragment to the DOM
};

// Populate a select element with options, such as genres or authors, and a default option
/**
 * Populates
 * @param {HTMLSelectElement} selectElement - The select element to populate.
 * @param {Array<{ id: string, name: string }>} options - The options to add to the select.
 * @param {string} defaultOptionText - The text for the default option.
 */
const renderOptions = (selectElement, options, defaultOptionText) => {
    const fragment = document.createDocumentFragment();
    const defaultOption = document.createElement('option');
    defaultOption.value = 'any';
    defaultOption.innerText = defaultOptionText; // Set the text of the default option
    fragment.appendChild(defaultOption); // Append the default option to the fragment

 // Loop through options and create an option element for each

for (const option of options) {
    const element = document.createElement('option');
    element.value = option.id; // Set the value to the option ID
    element.innerText = option.name; // Set the displayed text to the option name
    fragment.appendChild(element);
}
selectElement.appendChild(fragment);
};

// Initialize Book List and Filters
// Render the initial list of books and populate genre and author filter dropdowns
renderBooks(matches);  // Display all books initially
renderOptions(document.querySelector('[data-search-genres]'), genreInstances, 'All Genres');
renderOptions(document.querySelector('[data-search-authors]'), authorInstances, 'All Authors');

//Theme Settings
// Apply selected theme by setting custom CSS properties for colors
/**
 * Applies the selected theme.
 * @param {string} theme - The name of the theme ('day' or 'night').
 */
const applyTheme = (theme) => {
// Set colors based on the selected theme (night or day)
  if (theme === 'night') {
    document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
    document.documentElement.style.setProperty('--color-light', '10, 10, 20');
  } else {
    document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
    document.documentElement.style.setProperty('--color-light', '255, 255, 255');
  }
};

// Event Handlers
// Handle book search based on title, author, and genre filters
/**
 * Handles the search for books
 * @param {Event} event - The submit event from the search form.
 */
const handleSearch = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
// Filter books based on the applied filters
    const result = bookInstances.filter(book => (
        (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
        (filters.author === 'any' || book.author === filters.author) &&
        (filters.genre === 'any' || book.genres.includes(filters.genre))
    ));
    page = 1; // Reset the page number for new search results
    matches = result // Update matches to the filtered results

    document.querySelector('[data-list-items]').innerHTML = '';
    renderBooks(matches); // Render the filtered list of books
// Show or hide the message if no results were found
 document.querySelector('[data-list-message]').classList.toggle('list__message_show', result.length < 1);
 document.querySelector('[data-search-overlay]').open = false;
};

// Handle theme change when user selects light or dark mode
/**
 * Handles theme changes 
 * @param {Event} event - The submit event from the theme settings form.
 */
const handleThemeChange = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    applyTheme(formData.get('theme')); // Apply the selected theme
    document.querySelector('[data-settings-overlay]').open = false;  // Close the settings overlay
};

// Function to load and display more books using the BookPreview component
const showMoreBooks = () => {
    const fragment = document.createDocumentFragment(); // Create a document fragment to hold book previews
    
    // Loop through the next set of books based on the current page
    for (const { id, title, author, image } of matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)) {
        const bookPreview = document.createElement('book-preview'); // Create a book-preview element
        bookPreview.setAttribute('id', id); // Set the book ID
        bookPreview.setAttribute('title', title); // Set the book title
        bookPreview.setAttribute('author', authors[author]);  // Set the book author
        bookPreview.setAttribute('image', image); // Set the book image

        // Listen for the book-selected event to handle book detail display
        bookPreview.addEventListener('book-selected', (event) => {
            displayBookDetails(event.detail.id); // Call function to display details for the selected book
        });

        fragment.appendChild(bookPreview); // Append the book preview component to the fragment
    }

    document.querySelector('[data-list-items]').appendChild(fragment); // Append the fragment to the DOM
    page += 1;

    // Update button text and disable if no more books to show
    listButton.innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${Math.max(matches.length - (page * BOOKS_PER_PAGE), 0)})</span>`;
    listButton.disabled = matches.length <= page * BOOKS_PER_PAGE; // Disable button if all books are displayed
};


// Show book details when user selects a book from the list
/**
 * Displays details for the selected book.
 * @param {string} id - The ID of the selected book.
 */
const displayBookDetails = (bookId) => {
    const book = matches.find((book) => book.id === bookId);
    if (book) {
        document.querySelector('[data-list-active]').open = true;
        document.querySelector('[data-list-blur]').src = book.image;
        document.querySelector('[data-list-image]').src = book.image;
        document.querySelector('[data-list-title]').innerText = book.title;
        document.querySelector('[data-list-subtitle]').innerText = `${authors[book.author]} (${new Date(book.published).getFullYear()})`;
        document.querySelector('[data-list-description]').innerText = book.description;
    }
};

// Set Initial Theme
// Set the starting theme based on the system's light or dark mode preference
applyTheme(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day');


// Add Event Listeners
// Link functions to form submissions, button clicks, and other user interactions
document.querySelector('[data-search-form]').addEventListener('submit', handleSearch);
document.querySelector('[data-settings-form]').addEventListener('submit', handleThemeChange);
document.querySelector('[data-list-button]').addEventListener('click', showMoreBooks);

document.querySelector('[data-list-items]').addEventListener('click', (event) => {
    const previewId = event.target.closest('[data-preview]')?.dataset.preview;
    if (previewId) displayBookDetails(previewId);
});

document.querySelector('[data-search-cancel]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = false;
});

document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = false;
});

document.querySelector('[data-header-search]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = true;
    document.querySelector('[data-search-title]').focus();
});

document.querySelector('[data-header-settings]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = true;
});

document.querySelector('[data-list-close]').addEventListener('click', () => {
    document.querySelector('[data-list-active]').open = false;
});



