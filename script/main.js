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

document.querySelector('main').classList.remove('d-none');

[newBook, importLibrary].forEach(btn => btn.addEventListener('click', toggleBookForm));
clearLibrary.addEventListener('click', clearAllBooks);
saveLibrary.addEventListener('click', saveLibraryToFile);
bookForm.addEventListener('submit', (e) => submitBookForm(e));
importForm.addEventListener('submit', (e) => importLibraryFromFile(e, importForm));
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
  [actions, newBook, importLibrary, formContainer].forEach(el => {
    el.classList.toggle('d-none');
  });
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
    tableBody.innerHTML = '';
    localStorage.setItem('library', '[]');
  }
};

function saveLibraryToFile() {
  let blob = new Blob([localStorage.getItem('library')], { type: "text/plain;charset=utf-8" });
  saveAs(blob, `odin-library_${(new Date).toLocaleDateString()}.txt`);
};

function submitBookForm(event) {
  event.preventDefault();
  showAlert(bookForm);
  handleFormSubmission(bookForm);
};

function importLibraryFromFile(event, form) {
  event.preventDefault();
  const file = importForm.elements[0].files[0];
  
  if (file && file.type === 'text/plain') {
    if (confirm('This will overwrite your current library. Are you sure?')) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.addEventListener('load', () => {
        localStorage.setItem('library', reader.result);
        resetTable();
      });
      form.reset();
      toggleBookForm()
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
  if (!localStorage.getItem('library')) localStorage.setItem('library', '[]');

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
