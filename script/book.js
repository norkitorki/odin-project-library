class Book {
  static bookCount() {
    return Number(localStorage.getItem('bookCount'));
  }

  static updateBookCount(step = Book.bookCount() + 1) {
    localStorage.setItem('bookCount', step);
  }

  static resetBookCount() {
    return localStorage.setItem('bookCount', 0);
  }

  constructor(title, author, pages, year, read) {
    if (!Book.bookCount()) Book.resetBookCount();
    Book.updateBookCount();

    this.title  = title;
    this.author = author;
    this.pages  = Number(pages);
    this.year   = Number(year);
    this.read   = read;
    this.id     = Number(Book.bookCount());
  }

  update(property, value) {
    return this[property] = value;
  }
};
