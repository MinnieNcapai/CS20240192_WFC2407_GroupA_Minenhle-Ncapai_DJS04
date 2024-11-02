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
}
