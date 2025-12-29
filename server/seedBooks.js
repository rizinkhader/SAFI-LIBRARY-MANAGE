const mongoose = require('mongoose');
const Book = require('./models/Book');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/safi_library')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const books = [
    {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        isbn: "9780743273565",
        category: "Classic Fiction",
        quantity: 5,
        availableCount: 5,
        coverImage: "https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg"
    },
    {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        isbn: "9780061120084",
        category: "Classic Fiction",
        quantity: 3,
        availableCount: 3,
        coverImage: "https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg"
    },
    {
        title: "1984",
        author: "George Orwell",
        isbn: "9780451524935",
        category: "Dystopian",
        quantity: 8,
        availableCount: 8,
        coverImage: "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg"
    },
    {
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        isbn: "9780547928227",
        category: "Fantasy",
        quantity: 10,
        availableCount: 10,
        coverImage: "https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg"
    },
    {
        title: "Harry Potter and the Sorcerer's Stone",
        author: "J.K. Rowling",
        isbn: "9780590353427",
        category: "Fantasy",
        quantity: 12,
        availableCount: 12,
        coverImage: "https://covers.openlibrary.org/b/isbn/9780590353427-L.jpg"
    },
    {
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        isbn: "9780316769488",
        category: "Classic Fiction",
        quantity: 4,
        availableCount: 4,
        coverImage: "https://covers.openlibrary.org/b/isbn/9780316769488-L.jpg"
    },
    {
        title: "Pride and Prejudice",
        author: "Jane Austen",
        isbn: "9781503290563",
        category: "Romance",
        quantity: 6,
        availableCount: 6,
        coverImage: "https://covers.openlibrary.org/b/isbn/9781503290563-L.jpg"
    },
    {
        title: "The Da Vinci Code",
        author: "Dan Brown",
        isbn: "9780307474278",
        category: "Thriller",
        quantity: 7,
        availableCount: 7,
        coverImage: "https://covers.openlibrary.org/b/isbn/9780307474278-L.jpg"
    },
    {
        title: "Sapiens: A Brief History of Humankind",
        author: "Yuval Noah Harari",
        isbn: "9780062316097",
        category: "Non-Fiction",
        quantity: 5,
        availableCount: 5,
        coverImage: "https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg"
    },
    {
        title: "Clean Code",
        author: "Robert C. Martin",
        isbn: "9780132350884",
        category: "Technology",
        quantity: 2,
        availableCount: 2,
        coverImage: "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg"
    }
];

const seedBooks = async () => {
    try {
        await Book.deleteMany({}); // Optional: clear existing books to avoid dupes or mess
        console.log('Cleared existing books...');

        await Book.insertMany(books);
        console.log('Added sample books!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedBooks();
