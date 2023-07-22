class BookTable {
  constructor(tableBody) {
    this.body = tableBody;
  }

  addBook(book, templateId, properties = ['id', 'title', 'author', 'pages', 'year', 'read']) {
    const clone = document.getElementById(templateId).content.cloneNode(true);
    clone.querySelector('tr').dataset.book = book.id;

    properties.forEach(prop => clone.querySelector(`.book-${prop}`).textContent = book[prop]);

    this.body.appendChild(clone);
  }

  removeBook(book) {
    const node = document.querySelector(`[data-book="${book.id}"]`);
    return this.body.removeChild(node);
  }

  reset(books) {
    const ids = books.map(book => book.id);

    let replacement;
    ids.forEach(id => {
      replacement = document.querySelector(`[data-book="${id}"]`);
      this.body.appendChild(this.body.removeChild(replacement));
    })
  }

  clear() {
    return this.body.innerHTML = '';
  }
};
