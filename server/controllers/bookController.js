const Book = require('../models/Book');

exports.getBooks = async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        res.json(books);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ msg: 'Book not found' });
        }
        res.json(book);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Book not found' });
        }
        res.status(500).send('Server Error');
    }
};

exports.addBook = async (req, res) => {
    const { title, author, isbn, category, quantity, coverImage } = req.body;

    try {
        let book = await Book.findOne({ isbn });
        if (book) {
            return res.status(400).json({ msg: 'Book already exists' });
        }

        book = new Book({
            title,
            author,
            isbn,
            category,
            quantity,
            availableCount: quantity,
            coverImage
        });

        await book.save();
        res.json(book);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateBook = async (req, res) => {
    const { title, author, isbn, category, quantity, coverImage } = req.body;

    try {
        let book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ msg: 'Book not found' });
        }

        // Adjust available count based on quantity change if needed logic can be complex
        // For simplicity, we assume available count shifts by the same diff as quantity
        const quantityDiff = quantity - book.quantity;

        book.title = title || book.title;
        book.author = author || book.author;
        book.isbn = isbn || book.isbn;
        book.category = category || book.category;
        book.quantity = quantity; // Update quantity
        book.availableCount = book.availableCount + quantityDiff;
        book.coverImage = coverImage || book.coverImage;

        await book.save();
        res.json(book);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteBook = async (req, res) => {
    try {
        // findByIdAndDelete is shorter
        const book = await Book.findByIdAndDelete(req.params.id);

        if (!book) {
            return res.status(404).json({ msg: 'Book not found' });
        }

        res.json({ msg: 'Book removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Book not found' });
        }
        res.status(500).send('Server Error');
    }
};
