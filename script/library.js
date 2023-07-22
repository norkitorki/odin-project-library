class Library {
  #library = [];

  constructor(name, ...books) {
    this.name = name;
    this.#library = JSON.parse(this.remoteLibrary()) || books;
    this.update();
  }

  addBook(book) {
    this.#library.push(book);
    this.update();
  }

  removeBook(book) {
    this.#library.splice(this.indexOf(book), 1);
    this.update();
  }

  updateBook(book, property, value) {
    this.#library[this.indexOf(book)][property] = value;
    this.update();
    return value;
  }

  update(content = null) {
    localStorage.setItem(this.name, content || this.toString());
  }

  saveToFile() {
    const blob = new Blob([this.toString()], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `odin-library_${(new Date).toLocaleDateString()}.txt`);
  }

  importFromFile(fileContent) {
    this.#library = JSON.parse(fileContent);
    return this.update();
  }

  sort(property) {
    let x, y
  
    this.#library.sort((a, b) => {
      if (Number(a[property])) {
        x = a[property], y = b[property];
      } else {
        x = a[property].toUpperCase(), y = b[property].toUpperCase();
      }
      
      return x == y ? 0 : x > y ? 1 : -1;
    })

    return this.update();
  }

  indexOf(book) {
    return this.#library.findIndex(b => b.id === book.id);
  }

  toString() {
    return JSON.stringify(this.#library);
  }

  toArray() {
    return this.#library;
  }

  clear() {
    this.#library = [];
    return this.update('[]');
  }

  remoteLibrary() {
    return localStorage.getItem(this.name);
  }
};
