const sqlite3 = require('sqlite3');
const express = require('express');

const app = express();

app.get('/:volume', sendVolume);
app.get('/:volume/:book', sendBook);
app.get('/:volume/:book/:chapter', sendChapter);

function sendVolume(req, res) {
}

function sendBook(req, res) {
}

function sendChapter(req, res) {
}

app.listen(process.env.PORT || 3000);
