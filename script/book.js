class Book {
  constructor(title, author, pages, year, read, id) {
    this.title  = title;
    this.author = author;
    this.pages  = Number(pages);
    this.year   = Number(year);
    this.read   = read;
    this.id     = Number(id) || null;
  }

  update(property, value) {
    return this[property] = value;
  }
};
