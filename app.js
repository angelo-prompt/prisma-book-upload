
// Express:
const express = require('express');
require('dotenv').config();

// Body Parser:
const bodyParser = require('body-parser');

// Prisma Client:
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

// Home route:
app.get('/', (req, res) => {
    res.json({ message: 'hello world.' });
})

// Get all authors:
app.get('/authors', async (req, res) => {
    const authors = await prisma.author.findMany();
    return res.json(authors);
})

// Get all books:
app.get('/books', async (req, res) => {
    const books = await prisma.book.findMany();
    return res.json(books);
})

// Get all categories:
app.get('/categories', async (req, res) => {
    const books = await prisma.category.findMany();
    return res.json(books);
})

// Get author by its id and get its books:
app.get('/authors/:authorId', async (req, res) => {

    const { authorId } = req.params;

    try{
        const author = await prisma.author.findUnique({
            where: {
                id: parseInt(authorId)
            },
            include: {
                books: true
            }
        })

        return res.json(author);

    }catch(err){

        console.log(err);
        return res.json({ err });
    }
})

// Get book by its id and get its author:
app.get('/books/:bookId', async (req, res) => {

    const { bookId } = req.params;

    try{
        const book = await prisma.book.findUnique({
            where: {
                id: parseInt(bookId)
            },
            include: {
                author: true,
                categories: true
            }
        })

        return res.json(book);

    }catch(err){

        console.log(err);
        return res.json({ err });
    }
})

// Create a new author:
app.post('/create-author', async (req, res) => {
    try{
        const newAuthor = await prisma.author.create({
            data: req.body
        })

        return res.json({
            ok: true,
            newAuthor
        })

    }catch(err){

        console.log(err);
        return res.json({ err });
    }
})

// Create a book:
app.post('/create-book', async (req, res) => {

    const { title, year, authorId } = req.body;

    // Formatting categories:
    const categories = req.body.categories.map(category => {
        return {
            name: category.toLowerCase()
        }
    })

    try{
        // Add categories in the Category table:
        await prisma.category.createMany({
            data: categories,
            skipDuplicates: true
        })

        // Get the id of the categories involved:
        const involvedCategoriesIds = await prisma.category.findMany({
            where: {
                name: {
                    in: req.body.categories
                }
            },
            select: {
                id: true
            }
        })

        /* Add the new book to in the Book table 
        and connect to it its categories: */
        const newBook = await prisma.book.create({
            data: {
                title,
                year,
                authorId,
                categories: {
                    connect: involvedCategoriesIds
                }
            }
        })

        return res.json({
            ok: true,
            newBook
        });

    }catch(err){

        console.log(err);
        return res.json({ err });
    }
})

// Delete an author:
app.delete('/delete-author/:authorId', async (req, res) => {

    const authorId = parseInt(req.params.authorId);

    try{
        await prisma.book.deleteMany({
            where: {
                authorId
            }
        })
        const deletedAuthor = await prisma.author.delete({
            where: {
                id: authorId
            }
        })

        return res.json({
            ok: true,
            deletedAuthor
        })

    }catch(err){

        console.log(err);
        return res.json({ err });
    }
})

// Delete a book:
app.delete('/delete-book/:bookId', async (req, res) => {

    const { bookId } = req.params;

    try{
        const deletedBook = await prisma.book.delete({
            where: {
                id: parseInt(bookId)
            }
        })

        return res.json({
            ok: true,
            deletedBook
        })

    }catch(err){

        console.log(err);
        return res.json({ err });
    }
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`);
})


