import express from 'express';
import db from 'sqlite';

const app = express();

app.get('/', getVolumes);
app.get('/:volume', getVolume);
app.get('/:volume/:book', getBook);
app.get('/:volume/:book/:chapter', getChapter);
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ error: 'Internal server error.' })
  next();
});

async function getVolumes(req, res, next) {
  try {
    const volumes = await db.all('SELECT * FROM volumes');
    res.send({ data: { volumes } });
  } catch (err) {
    next(err);
  }
}

async function getVolume(req, res, next) {
  try {
    const volume = await db.get(
      'SELECT * FROM volumes WHERE uri=?', req.params.volume);
    if (!volume) {
      res.status(404).send({ error: `Volume not found.` });
      return;
    }
    const books = await db.all(
      'SELECT * FROM books WHERE volumeId=?', volume.id)
    volume.books = books;
    res.send({ data: { volume } });
  } catch (err) {
    next(err);
  }
}

async function getBook(req, res, next) {
  try {
    const volume = await db.get(
      'SELECT * FROM volumes WHERE uri=?', req.params.volume)
    if (!volume) {
      res.status(404).send({ error: 'Volume not found.' });
      return;
    }
    const book = await db.get(
      'SELECT * FROM books WHERE uri=? AND volumeId=?',
      [req.params.book, volume.id])
    if (!book) {
      res.status(404).send({ error: 'Book not found in volume.'})
    }
    const chapters = await db.all(
      'SELECT * FROM chapters WHERE bookId=?', book.id)
    volume.book = book;
    volume.book.chapters = chapters;
    res.send({ data: { volume } });
  } catch (err) {
    next(err);
  }
}

async function getChapter(req, res, next) {
  try {
    const volume = await db.get(
      'SELECT * FROM volumes WHERE URI=?', req.params.volume);
    if (!volume) {
      res.status(404).send({ error: 'Volume not found.' });
      return;
    }
    const book = await db.get(
      'SELECT * FROM books WHERE uri=? AND volumeId=?',
      [req.params.book, volume.id]);
    if (!book) {
      res.status(404).send({ error: 'Book not found in volume.' })
      return;
    }
    const chapter = await db.get(
      'SELECT * FROM chapters WHERE number=? AND bookId=?',
      [req.params.chapter, book.id]);
    if (!chapter) {
      res.status(404).send({ error: 'Chapter does not exist.' });
      return;
    }
    const verses = await db.all(
      'SELECT * FROM verses WHERE chapterId=?', chapter.id);
    volume.book = book;
    volume.book.chapter = chapter;
    volume.book.chapter.verses = verses;
    res.send({ data: { volume } })
  } catch (err) {
    next(err);
  }
}

db.open('scriptures.db')
  .then(() => app.listen(process.env.PORT || 3000));
