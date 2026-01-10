var ViewModel = function () {
    var self = this;
    self.books = ko.observableArray();
    self.error = ko.observable();
    self.detail = ko.observable();
    self.authors = ko.observableArray()
    self.edit = ko.observable();
    self.selectedValue = ko.observable();
    self.deleteBook = ko.observable();
    self.delete= ko.observable();
    self.newBook = {
        Author: ko.observable(),
        Genre: ko.observable(),
        Price: ko.observable(),
        Title: ko.observable(),
        Year: ko.observable()
    }

    var booksUri = '/api/books/';
    var authorsUri = '/api/authors/';

    function ajaxHelper(uri, method, data) {
        self.error(''); // Clear error message
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null
        }).fail(function (jqXHR, textStatus, errorThrown) {
            self.error(errorThrown);
        });
    }

    function getAllBooks() {
        ajaxHelper(booksUri, 'GET').done(function (data) {
            self.books(data);
        });
    }

    self.getBookDetail = function (item) {
        ajaxHelper(booksUri + item.Id, 'GET').done(function (data) {
            self.detail(data);
        });
    }

    function getAuthors() {
        ajaxHelper(authorsUri, 'GET').done(function (data) {
            self.authors(data);
        });
    }

    self.addBook = function (formElement) {
        var book = {
            AuthorId: self.newBook.Author().Id,
            Genre: self.newBook.Genre(),
            Price: self.newBook.Price(),
            Title: self.newBook.Title(),
            Year: self.newBook.Year()
        };

        ajaxHelper(booksUri, 'POST', book.Id, book).done(function (item) {
            self.books.push(item);
        });
    }
    self.editBook = function (data) {
       
        ajaxHelper(booksUri, 'PUT', data.Id, data).done(function (item) {
            self.books.push(item);
        });
    }
    self.getEditBook = function (book) {  
        
        ajaxHelper(booksUri + book.Id, 'GET').done(function (data) {          
            self.edit(data)
            self.selectedValue(data.AuthorId);
        });
    };
   
    self.getDeleteBook = function (book) {
        if (window.confirm("Are you sure you want to delete this book?")) {
            ajaxHelper(booksUri, 'DELETE', book.Id).done(function (data) {
                self.items.remove(data);
            });
        }
    };
    self.updateBook = function (data) {
        $.ajax({
            url: "api/books/" + data.Id,
            data: data,
            type: "PUT",
            success: self.books
        });
    };
    self.deleteBook = function (book) {
        $.ajax({
            url: "api/books/" + book.Id,
            type: "DELETE",
            success: self.books
        });
    };
    
    // Fetch the initial data.
    getAllBooks();
    getAuthors();
};

ko.applyBindings(new ViewModel());