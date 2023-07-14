const newBook           = document.querySelector('.new-book');
const form              = document.forms['bookForm'];
const sortTable         = document.querySelector('.table-sort');
const tableBody         = document.querySelector('tbody');
const newBookForm       = document.querySelector('form');
const newBookFormSubmit = newBookForm.querySelector('button[type=submit]');

let library = [];

function Book(title, author, pages, year, read, id = null) {
  this.title = title;
  this.author = author;
  this.pages = Number(pages);
  this.year = Number(year);
  this.read = read;
  this.id = id;
};

function sortBooksTable() {
  if ((new Book).hasOwnProperty(this.value)) {
    sortLibrary(library, this.value);
    tableBody.innerHTML = '';
    addBooksToTable(tableBody, library);
  }
};

function sortLibrary(library, property) {
  let x, y;
  library.sort((a, b) => {
    if (Number(a[property])) {
      x = a[property], y = b[property];
    } else {
      x = a[property].toUpperCase(), y = b[property].toUpperCase();
    }
  
    return x == y ? 0 : x > y ? 1 : -1;
  })
};
function addBookToLibrary(library, ...args) {
  const book = new Book(...args);
  book.id = library.length + 1;
  library.push(book);
  return book;
};

function addBooksToTable(tableBody, books) {
  const template = document.getElementById('book-template');
  let clone, node;

  books.forEach(book => {
    clone = template.content.cloneNode(true);
    clone.querySelector('tr').dataset.book = book.id;
    
    for(attr in book) {
      node = clone.querySelector(`.book-${attr}`);
      
      if (node && book.hasOwnProperty(attr)) {
        node.textContent = book[attr];

        if (attr === 'read') {
          node.addEventListener('click', (event) => event.target.textContent = book.toggleRead());
          clone.querySelector('.book-delete').addEventListener('click', () => book.destroy());
        }
      }
    }

    tableBody.appendChild(clone);
  })
};
