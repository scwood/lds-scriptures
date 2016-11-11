import express from 'express';
import db from 'sqlite';

const app = express();

app.get('/:volume', sendVolume);
app.get('/:volume/:book', sendBook);
app.get('/:volume/:book/:chapter', sendChapter);
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ error: 'Internal server error.' })
  next();
});

async function sendVolume(req, res, next) {
  try {
    const volume = await db.get('SELECT * FROM volumes WHERE uri=?', req.params.volume);
    if (!volume) {
      res.status(404).send({ error: `Volume not found.` });
      return;
    }
    const books = await db.all('SELECT * FROM books WHERE volumeId=?', volume.id)
    volume.books = books;
    res.send({ data: { volume } });
  } catch (err) {
    next(err);
  }
}

async function sendBook(req, res, next) {
  try {
    const volume = await db.get('SELECT * FROM volumes WHERE uri=?', req.params.volume)
    if (!volume) {
      res.status(404).send({ error: `Volume not found.` });
      return;
    }
    const book = await db.get('SELECT * FROM books WHERE uri=? AND volumeId=?', [
      req.params.book,
      volume.id
    ])
    if (!book) {
      res.status(404).send({ error: 'Book not vound in volume.'})
    }
    volume.book = book;
    const chapters = await db.all('SELECT * FROM chapters WHERE bookId=?', book.id)
    volume.book.chapters = chapters;
    res.send({ data: { volume } });
  } catch (err) {
    next(err);
  }
}

async function sendChapter(req, res, next) {
  try {
    const volume = await db.get('SELECT * FROM volumes WHERE URI=?', [req.params.volume]);
    if (!volume) {
      res.status(404).send({ error: 'Volume not found.' });
      return;
    }
    const book = await db.get('SELECT * FROM books WHERE uri=? AND volumeId=?', [
      req.params.book, volume.id
    ])
    if (!book) {
      res.status(404).send({ error: 'Book not found in volume.' })
      return;
    }
    volume.book = book;
    const chapter = await db.get('SELECT * FROM chapters WHERE chapterNumber=? AND bookId=?', [
      req.params.chapter, book.id
    ]);
    if (!chapter) {
      res.status(404).send({ error: 'Chapter does not exist.' });
      return;
    }
    volume.book.chapter = chapter;
    const verses = await db.all('SELECT * FROM verses WHERE chapterId=?', chapter.id);
    volume.book.chapter.verses = verses;
    res.send({ data: { volume } })
  } catch (err) {
    next(err);
  }
}

db.open('scriptures.db')
  .then(() => app.listen(process.env.PORT || 3000));
