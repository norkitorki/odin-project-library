const newBook           = document.querySelector('.new-book');
const form              = document.forms['bookForm'];
const sortTable         = document.querySelector('.table-sort');
const tableBody         = document.querySelector('tbody');
const newBookForm       = document.querySelector('form');
const newBookFormSubmit = newBookForm.querySelector('button[type=submit]');

let library = [];
