// Define a custom HTML element called "book-preview" for displaying book information
class BookPreview extends HTMLElement {
    constructor() {
        super(); // Call the parent constructor
        this.attachShadow({ mode: 'open' }); // Create a shadow DOM to encapsulate the component's HTML and CSS
        this.render(); // Initial rendering of the component
    }

// Specify the attributes that the element listens to for changes
    static get observedAttributes() {
        return ['title', 'author', 'image', 'id'];
    }

// Handle changes to the observed attributes
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();  // Re-render the component when any of the observed attributes change
        }
    }

 // Render the HTML structure and styles for the component
    render() {
    // Retrieve attributes or set default values if attributes are missing
            const title = this.getAttribute('title') || 'Unknown Title';
            const author = this.getAttribute('author') || 'Unknown Author';
            const image = this.getAttribute('image') || '';
            const id = this.getAttribute('id') || '';
    
            
 // Set up the component's HTML and CSS, including event listeners
        this.shadowRoot.innerHTML = `
        <style>
     :root {
                --color-blue: 0, 150, 255;
        --color-force-dark: 10, 10, 20;
        --color-force-light: 255, 255, 255;
        --color-dark: 10, 10, 20;
        --color-light: 255, 255, 255;
        }

                    .preview {
        border-width: 0;
        width: 100%;
        font-family: Roboto, sans-serif;
        padding: 0.5rem 1rem;
        display: flex;
        align-items: center;
        cursor: pointer;
        text-align: left;
        border-radius: 8px;
        border: 1px solid rgba(var(--color-dark), 0.15);
        background: rgba(var(--color-light), 1);
        }

        @media (min-width: 60rem) {
        .preview {
        padding: 1rem;
        }
        }

        .preview_hidden {
        display: none;
        }

        .preview:hover {
        background: rgba(var(--color-blue), 0.05);
        }

        .preview__image {
        width: 48px;
        height: 70px;
        object-fit: cover;
        background: grey;
        border-radius: 2px;
        box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
        0px 1px 1px 0px rgba(0, 0, 0, 0.1), 0px 1px 3px 0px rgba(0, 0, 0, 0.1);
        }

        .preview__info {
        padding: 1rem;
        }

        .preview__title {
        margin: 0 0 0.5rem;
        font-weight: bold;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;  
        overflow: hidden;
        color: rgba(var(--color-dark), 0.8)
        }

        .preview__author {
        color: rgba(var(--color-dark), 0.4);
        }
        </style>
            <button class="preview" data-preview="${id}">
                <img class="preview__image" src="${image}" alt="${title} cover" />
                <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${author}</div>
                </div>
            </button>
            `;

    // Add event listener to handle click events on the preview button
     this.shadowRoot.querySelector('.preview').addEventListener('click', () => {
    // Dispatch a custom event with the book's ID when clicked
                    this.dispatchEvent(new CustomEvent('book-selected', {
                        detail: { id }, // Send the book ID as event data
                        bubbles: true, // Allow event to bubble up through the DOM
                        composed: true // Allow event to cross the shadow DOM boundary
                    }));
                });
            }
        }
        
    // Define the new element
        customElements.define('book-preview', BookPreview);
               

