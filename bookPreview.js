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
    }
    
