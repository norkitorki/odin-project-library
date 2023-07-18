const newBook       = document.querySelector('.new-book');
const form          = document.forms['bookForm'];
const sortTable     = document.querySelector('.table-sort');
const tableBody     = document.querySelector('tbody');
const formContainer = document.querySelector('.form-container');

document.querySelector('main').classList.remove('d-none');

newBook.addEventListener('click', toggleBookForm);
form.addEventListener('submit', (event) => {
  event.preventDefault();
  showAlert();
  handleFormSubmission();
});
sortTable.addEventListener('change', sortBooks);

function Book(title, author, pages, year, read, id = null) {
  this.title = title;
  this.author = author;
  this.pages = Number(pages);
  this.year = Number(year);
  this.read = read;
  this.id = id;
};

Book.prototype = {
  toggleRead: function() {
    updateBookInLibrary.call(this, 'read', !this.read);
    return this.read;
  },

  destroy: function() {
    if (confirm('Are you sure?')) {
      const node = document.querySelector(`[data-book="${this.id}"]`);
      if (node) {
        node.parentElement.removeChild(node);
        destroyBookFromLibrary.call(this);
      }
    }
  }
};

function toggleBookForm() {
  [newBook, formContainer].forEach(el => el.classList.toggle('d-none'));
};

function handleFormSubmission() {
  if (form.checkValidity()) {
    createBookFromForm(form);
    toggleBookForm();
    form.reset();
    form.classList.remove('was-validated');
  } else {
    form.classList.add('was-validated');
  }
};

function showAlert() {
  const type = form.checkValidity() ? '.alert-success' : '.alert-danger';
  const alert = document.querySelector(type);
  setTimeout(() => alert.classList.add('d-none'), 5000);
  alert.classList.remove('d-none');
};

function sortBooks() {
  const property = this.value
  if ((new Book).hasOwnProperty(property)) {
    let x, y, library = retrieveLibrary();

    library.sort((a, b) => {
      if (Number(a[property])) {
        x = a[property], y = b[property];
      } else {
        x = a[property].toUpperCase(), y = b[property].toUpperCase();
      }
    
      return x == y ? 0 : x > y ? 1 : -1;
    })

    updateLibrary(library);
    resetTable(library);
  }
};

function createBookFromForm(form) {
  const attributes = Array.from(form.querySelectorAll('input')).map(input => {
    return input.id === 'book_read' ? input.checked : input.value
  });
  const book = addBookToLibrary(...attributes);
  addBookToTable(book);
};

function addBookToLibrary(...args) {
  if (!localStorage.getItem('library')) localStorage.setItem('library', JSON.stringify([]));

  const library = retrieveLibrary();
  const book = new Book(...args);
  book.id = library.length + 1;
  library.push(book);
  updateLibrary(library);
  return book;
};

function retrieveLibrary() {
  return JSON.parse(localStorage.getItem('library'));
};

function retrieveBookIndex(id, library = retrieveLibrary()) {
  return library.findIndex(book => book.id === id);
};

function updateLibrary(library) {
  return localStorage.setItem('library', JSON.stringify(library));
};

function updateBookInLibrary(property, value) {
  const library = retrieveLibrary(), index = retrieveBookIndex(this.id, library);
  library[index][property] = value;
  updateLibrary(library);
  resetTable(library);
};

function destroyBookFromLibrary() {
  const library = retrieveLibrary(), index = retrieveBookIndex(this.id, library);
  library.splice(index, 1);
  updateLibrary(library);
};

function addBookToTable(book) {
  const template = document.getElementById('book-template');
  let clone, node;

  Object.setPrototypeOf(book, Book.prototype);

  clone = template.content.cloneNode(true);
  clone.querySelector('tr').dataset.book = book.id;

  for(property in book) {
    node = clone.querySelector(`.book-${property}`);

    if (node && book.hasOwnProperty(property)) {
      node.textContent = book[property];

      if (property === 'read') {
        node.addEventListener('click', (event) => event.target.textContent = book.toggleRead());
        clone.querySelector('.book-delete').addEventListener('click', () => book.destroy());
      }
    }
  }

  tableBody.appendChild(clone);
};

function resetTable(library = retrieveLibrary()) {
  tableBody.innerHTML = '';
  library.forEach(book => addBookToTable(book))
};

if (!localStorage.getItem('library')) {
  addBookToLibrary('The Hobbit', 'J.R.R. Tolkien', '310', 1937, false);
};

resetTable();
