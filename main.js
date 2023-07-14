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
