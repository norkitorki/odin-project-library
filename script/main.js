const actions       = document.querySelector('.actions');
const newBook       = document.querySelector('.new-book');
const clearLibrary  = document.querySelector('.clear-library');
const saveLibrary   = document.querySelector('.save-library');
const importLibrary = document.querySelector('.import-library');
const formContainer = document.querySelector('.form-container');
const bookForm      = document.forms['bookForm'];
const importForm    = document.forms['importForm'];
const sortTable     = document.querySelector('.table-sort');
const tableBody     = document.querySelector('tbody');

const library = new Library('library', new Book('The Hobbit', 'J.R.R. Tolkien', '310', 1937, false));
const table   = new BookTable(tableBody);

document.querySelector('main').classList.remove('d-none');

[newBook, importLibrary].forEach(btn => btn.addEventListener('click', toggleBookForm));
clearLibrary.addEventListener('click', clearAllBooks);
saveLibrary.addEventListener('click', saveLibraryToFile);
bookForm.addEventListener('submit', (e) => submitBookForm(e));
importForm.addEventListener('submit', (e) => importLibraryFromFile(e, library, importForm));
sortTable.addEventListener('change', sortBooks);

function toggleBookForm() {
  [actions, newBook, importLibrary, formContainer].forEach(el => el.classList.toggle('d-none'));

  if (this === newBook) {
    bookForm.classList.remove('d-none');
    importForm.classList.add('d-none');
  } else if (this === importLibrary) {
    bookForm.classList.add('d-none');
    importForm.classList.remove('d-none');
  }
};

function clearAllBooks() {
  if (confirm('You are about to delete all books. Are you sure?')) {
    table.clear();
    library.clear();
    Book.resetBookCount();
  }
};

function saveLibraryToFile() {
  return library.saveToFile();
}

function submitBookForm(event) {
  event.preventDefault();
  showAlert(bookForm);
  handleFormSubmission(bookForm);
};

function importLibraryFromFile(event, library, form) {
  event.preventDefault();
  const file = importForm.elements[0].files[0];
  
  if (file && file.type === 'text/plain') {
    if (confirm('This will overwrite your current library. Are you sure?')) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.addEventListener('load', () => {
        library.importFromFile(reader.result);
        Book.updateBookCount(library.toArray().length);
        resetTable();
      });
      form.reset();
      toggleBookForm();
    }
  } else {
    alert('No file has been selected or the file format is invalid');
  }
};

function handleFormSubmission(form) {
  if (form.checkValidity()) {
    createBookFromForm(form);
    toggleBookForm();
    form.reset();
    form.classList.remove('was-validated');
  } else {
    form.classList.add('was-validated');
  }
};

function showAlert(form) {
  const type = form.checkValidity() ? '.alert-success' : '.alert-danger';
  const alert = document.querySelector(type);
  setTimeout(() => alert.classList.add('d-none'), 5000);
  alert.classList.remove('d-none');
};

function sortBooks() {
  if (this.value !== 'Sort by') {
    library.sort(this.value);
    table.reset(library.toArray());
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
  const book = new Book(...args);
  library.addBook(book);
  return book;
};

function addBookToTable(book) {
  table.addBook(book, 'book-template');

  table.body.querySelector(`[data-book="${book.id}"] .book-read`).addEventListener('click', function(event) {
    event.preventDefault();
    this.textContent = library.updateBook(book, 'read', !book.read);
  });

  table.body.querySelector(`[data-book="${book.id}"] .book-delete`).addEventListener('click', function() { removeBook(book) });
};

function removeBook(book) {
  if (confirm('Are you sure?')) {
    Book.updateBookCount();
    table.removeBook(book);
    library.removeBook(book);
  }
}

function resetTable() {
  table.clear();
  Book.resetBookCount();
  library.toArray().forEach(book => {
    if (book.id > Book.bookCount()) Book.updateBookCount(book.id);
    addBookToTable(book);
  })
};

resetTable();
